import { snakeCase } from "lodash-es";
import convertCase from "./convertCase.js";

export default function formatInput(obj) {
  if (Array.isArray(obj)) {
    return obj.map((v) => formatInput(v));
  }
  return convertCase(obj, formatInput, snakeCase);
}
