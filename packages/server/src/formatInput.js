import { snakeCase } from "lodash-es";
import convertCase from "./convertCase.js";

export default function formatInput(obj) {
  return convertCase(obj, formatInput, snakeCase);
}
