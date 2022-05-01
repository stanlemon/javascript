import { isObject, isString } from "lodash-es";

export default function convertCase(obj, me, convert) {
  if (
    isString(obj) &&
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.test(
      obj
    )
  ) {
    return new Date(obj);
  } else if (Array.isArray(obj)) {
    return obj.map((i) => me(i));
  } else if (isObject(obj) && !Array.isArray(obj)) {
    const n = {};
    Object.keys(obj).forEach((k) => (n[convert(k)] = me(obj[k])));
    return n;
  } else {
    return obj;
  }
}
