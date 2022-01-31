import { camelCase, isArray, isDate } from "lodash-es";
import convertCase from "./convertCase.js";

export default function formatOutput(obj) {
  if (isDate(obj)) {
    return obj.toISOString();
  }
  if (isArray(obj)) {
    return obj.map((v) => formatOutput(v));
  }
  return convertCase(obj, formatOutput, camelCase);
}
