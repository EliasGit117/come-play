export function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== void 0;
}