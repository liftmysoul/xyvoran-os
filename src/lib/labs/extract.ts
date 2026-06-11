import "server-only";
import OpenAI from "openai";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { markerDefinitions } from "@/lib/labs/markers";
import type { LabCategory, NormalizedLabMarker } from "@/types/database";

type RawMarker = { name?: string; key?: string; value?: number | string; numericValue?: number | string; numeric_value?: number | string; "numeric value"?: number | string; unit?: string | null; referenceRange?: string | null; category?: string };

const categorySet = new Set<LabCategory>(["CBC", "CMP", "Lipids", "Hormones", "Inflammation", "Nutrients", "Other"]);

function normalize(raw: RawMarker[]): NormalizedLabMarker[] {
  const results = new Map<string, NormalizedLabMarker>();
  for (const item of raw) {
    const label = `${item.key ?? ""} ${item.name ?? ""}`.toLowerCase();
    const definition = markerDefinitions.find((candidate) => candidate.key === item.key || candidate.aliases.some((alias) => label.includes(alias)));
    const rawValue = item.value ?? item.numericValue ?? item.numeric_value ?? item["numeric value"];
    const value = typeof rawValue === "number" ? rawValue : Number.parseFloat(String(rawValue ?? "").replace(/,/g, ""));
    if (!definition || !Number.isFinite(value)) continue;
    results.set(definition.key, {
      key: definition.key,
      name: definition.name,
      value,
      unit: item.unit || definition.unit || null,
      referenceRange: item.referenceRange || null,
      category: categorySet.has(item.category as LabCategory) ? (item.category as LabCategory) : definition.category
    });
  }
  return [...results.values()];
}

function regexExtract(text: string) {
  const markers: RawMarker[] = [];
  for (const definition of markerDefinitions) {
    for (const alias of definition.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = text.match(new RegExp(`(?:^|\\n)\\s*${escaped}[^\\n\\d]{0,30}(-?\\d+(?:[.,]\\d+)?)\\s*([^\\s\\n]{0,12})?`, "i"));
      if (match) {
        markers.push({ key: definition.key, name: definition.name, value: match[1], unit: match[2] || definition.unit, category: definition.category });
        break;
      }
    }
  }
  return normalize(markers);
}

function findMarkerArray(value: unknown): RawMarker[] {
  if (Array.isArray(value) && value.some((item) => item && typeof item === "object" && ("value" in item || "numericValue" in item || "numeric_value" in item || "numeric value" in item))) return value as RawMarker[];
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  const keyedMarkers = Object.entries(record)
    .filter(([, item]) => item && typeof item === "object" && ("value" in item || "numericValue" in item || "numeric_value" in item || "numeric value" in item))
    .map(([key, item]) => ({ key, ...(item as RawMarker) }));
  if (keyedMarkers.length) return keyedMarkers;
  for (const key of ["biomarkers", "markers", "lab_results", "labResults", "results", "data"]) {
    const found = findMarkerArray(record[key]);
    if (found.length) return found;
  }
  return [];
}

function describeShape(value: unknown, depth = 0): string {
  if (depth > 2) return typeof value;
  if (Array.isArray(value)) return `array(${value.length})[${value[0] ? describeShape(value[0], depth + 1) : "empty"}]`;
  if (!value || typeof value !== "object") return typeof value;
  return `{${Object.entries(value as Record<string, unknown>).slice(0, 8).map(([key, item]) => `${key}:${describeShape(item, depth + 1)}`).join(",")}}`;
}

async function extractWithOpenAI(input: { text?: string; imageDataUrl?: string }) {
  if (!process.env.OPENAI_API_KEY?.trim()) return [];
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const markerList = markerDefinitions.map(({ key, name, aliases, category }) => ({ key, name, aliases, category }));
  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `Extract only measured lab results from this report. Return JSON with a biomarkers array. Each item must contain key, name, numeric value, unit, referenceRange, and category. Never infer missing values. Match markers against: ${JSON.stringify(markerList)}.${input.text ? `\nREPORT TEXT:\n${input.text.slice(0, 30000)}` : ""}`
    }
  ];
  if (input.imageDataUrl) content.push({ type: "image_url", image_url: { url: input.imageDataUrl, detail: "high" } });
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_VISION_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a precise laboratory report transcription engine. Extract values; do not diagnose, explain, or invent data." },
      { role: "user", content }
    ]
  });
  const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}");
  const rawMarkers = findMarkerArray(parsed);
  const normalized = normalize(rawMarkers);
  if (!normalized.length) {
    const shape = rawMarkers[0] ? Object.keys(rawMarkers[0]).join(", ") : describeShape(parsed);
    throw new Error(`The extraction model returned no supported normalized markers. Response fields: ${shape || "none"}.`);
  }
  return normalized;
}

export async function extractLabMarkers(buffer: Buffer, mimeType: string) {
  if (mimeType === "application/pdf") {
    const parsed = await pdf(buffer);
    const aiMarkers = await extractWithOpenAI({ text: parsed.text });
    const markers = aiMarkers.length ? aiMarkers : regexExtract(parsed.text);
    if (!markers.length) throw new Error("No supported biomarkers could be extracted from this PDF. Confirm that it contains selectable text or add OPENAI_API_KEY for enhanced extraction.");
    return markers;
  }
  if (!process.env.OPENAI_API_KEY?.trim()) throw new Error("Image lab extraction requires OPENAI_API_KEY because OCR runs through the server-side OpenAI vision model.");
  const markers = await extractWithOpenAI({ imageDataUrl: `data:${mimeType};base64,${buffer.toString("base64")}` });
  if (!markers.length) throw new Error("No supported biomarkers could be extracted from this image. Try a clearer, upright image of the full report.");
  return markers;
}
