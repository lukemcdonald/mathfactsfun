import { getErrorMessage } from "~/utils/getErrorMessage";

/**
 * Converts a timestamp to milliseconds.
 * Assumes timestamps greater than 10 billion are already in milliseconds,
 * otherwise treats them as seconds and converts to milliseconds.
 *
 * @param {number} timestamp - The timestamp to convert.
 * @returns {number} - The timestamp in milliseconds.
 */
function convertTimestampToMilliseconds(timestamp: number) {
  return timestamp > 1e10 ? timestamp : timestamp * 1000;
}

/**
 * Formats a timestamp into an ISO 8601 date string, or returns a default value.
 * If the conversion returns null (indicating an invalid or null timestamp),
 * the provided default value is returned instead.
 *
 * @param {null | number} timestamp - The timestamp to format.
 * @param {string} defaultValue - The default ISO string to return if the timestamp is null or invalid.
 * @returns {string} - The ISO formatted date string or the default value if the timestamp is null or invalid.
 */
export function formatDate(timestamp: null | number, defaultValue: string): string {
  return timestampToISOString(timestamp) || defaultValue;
}

/**
 * Converts a timestamp to an ISO 8601 formatted date string.
 * If the timestamp is null or invalid, returns null.
 * Handles timestamps in seconds or milliseconds.
 *
 * @param {null | number} timestamp - The timestamp to format.
 * @returns {null | string} - The ISO formatted date string or null if invalid timestamp.
 */
function timestampToISOString(timestamp: null | number): null | string {
  if (!timestamp) {
    return null;
  }

  try {
    const ms = convertTimestampToMilliseconds(timestamp);
    return new Date(ms).toISOString();
  } catch (error) {
    console.error('Invalid timestamp:', timestamp, 'Error:', getErrorMessage(error));
    return null;
  }
}
