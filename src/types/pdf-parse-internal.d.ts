declare module "pdf-parse/lib/pdf-parse.js" {
  type PdfResult = { text: string; numpages: number; info: Record<string, unknown>; metadata: unknown; version: string };
  export default function parse(buffer: Buffer, options?: Record<string, unknown>): Promise<PdfResult>;
}
