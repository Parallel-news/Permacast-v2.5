export function isValidBody<T extends Record<string, unknown>>(
  body: any,
  fields: (keyof T)[],
): body is T {
  return Object.keys(body).every((key) => fields.includes(key))
}
