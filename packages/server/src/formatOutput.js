import { camelCase, isObject, isArray, isDate, isEmpty, omit } from "lodash-es";
import convertCase from "./convertCase.js";

export default function formatOutput(o, omittedFields = []) {
  const obj =
    isObject(o) && !isEmpty(omittedFields) ? omit(o, omittedFields) : o;
  if (isDate(obj)) {
    return obj.toISOString();
  }
  if (isArray(obj)) {
    return obj.map((v) => formatOutput(v));
  }
  return convertCase(obj, formatOutput, camelCase);
}
