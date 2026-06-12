type DatabaseError = {
  code?: string | null;
  message?: string | null;
};

const missingSchemaCodes = new Set(["42P01", "42703", "PGRST204", "PGRST205"]);

export function isMissingSchemaError(error?: DatabaseError | null) {
  if (!error) return false;
  if (error.code && missingSchemaCodes.has(error.code)) return true;
  const message = error.message?.toLowerCase() ?? "";
  return message.includes("does not exist") || message.includes("could not find the table") || message.includes("schema cache");
}

export function databaseErrorMessage(error?: DatabaseError | null) {
  return error?.message?.trim() || "Unknown database error";
}
