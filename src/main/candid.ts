import { JsonArray, JsonObject, JsonValue } from '@dfinity/candid';

/**
 * Performs a shallow check on a value to determine if it is a JsonArray.
 * It will not check if individual items are JsonValues.
 *
 * @param value The value to check
 * @returns True if the provided value is a JsonArray, false otherwise
 */
export function isJsonArray(value: unknown): value is JsonArray {
  return Array.isArray(value);
}

/**
 * Performs a shallow check on a value to determine if it is a JsonObject.
 * It will not check if the object's keys are strings or if the entries
 * are JsonValues.
 *
 * @param value The value to check
 * @returns True if the provided value is a JsonObject, false otherwise
 */
export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value?.constructor === Object;
}

/**
 * Determines if a value is a JsonValue.
 *
 * @param value The value to check
 * @returns True if the provided value is a JsonValue, false otherwise
 */
export function isJsonValue(value: unknown): value is JsonValue {
  const valueType = typeof value;

  return (
    valueType === 'boolean' ||
    valueType === 'string' ||
    valueType === 'number' ||
    isJsonArray(value) ||
    isJsonValue(value)
  );
}
