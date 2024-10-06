import { isPlainObject } from "lodash-es";
import { formatInput, formatOutput } from "./index.js";

export default asyncJsonHandler;

/**
 * Handler for JSON responses.
 * This method ensures data formatting using {formatInput} and {formatOutput}.
 * Callbacks that are wrapped by this handler receive an additional argument {input} which contains the formatted input data.
 * If the request is a GET, the {input} is the request.params object.
 * If the request is a POST or PUT, the {input} is the request.body object.
 * @param {function} Express route handler function
 */
export function asyncJsonHandler(fn) {
  return async (req, res, next) => {
    try {
      const input = buildInput(req);

      const output = await fn(input, req, res, next);

      // If a value is returned we'll assume that we need to render it as JSON
      if (output !== undefined) {
        res.status(200).json(formatOutput(output));
      }
    } catch (ex) {
      // TODO: Add better support for validation errors
      if (ex.message === "Bad Request") {
        res.status(400).json({ error: formatError(ex) });
        return;
      }

      if (ex.message === "Not Authorized") {
        res.status(403).json({ error: formatError(ex) });
        return;
      }

      if (ex.message === "Not Found") {
        res.status(404).json({ error: formatError(ex) });
        return;
      }

      if (ex.message === "Already Exists") {
        res.status(409).json({ error: formatError(ex) });
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.error(ex);

        res.status(500).json({ error: formatError(ex) });
      } else {
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  };
}

function buildInput(req) {
  if (req.method === "POST" || req.method === "PUT") {
    return formatInput(req.body);
  } else if (req.method === "GET" || req.method === "DELETE") {
    const params = isPlainObject(req.params) ? req.params : {};
    return formatInput(params);
  }
}

function formatError(ex) {
  return ex.message + (ex.details ? ": " + ex.details : "");
}

export class BadRequestException extends Error {
  static MESSAGE = "Bad Request";
  static CODE = 400;

  constructor(details = null) {
    super(BadRequestException.MESSAGE);
    this.name = "BadRequestException";
    this.code = BadRequestException.CODE;
    this.details = details;
  }
}

export class NotAuthorizedException extends Error {
  static MESSAGE = "Not Authorized";
  static CODE = 403;

  constructor(details = null) {
    super(NotAuthorizedException.MESSAGE);
    this.name = "NotAuthorizedException";
    this.code = NotAuthorizedException.CODE;
    this.details = details;
  }
}

export class NotFoundException extends Error {
  static MESSAGE = "Not Found";
  static CODE = 404;

  constructor(details = null) {
    super(NotFoundException.MESSAGE);
    this.name = "NotFoundException";
    this.code = NotFoundException.CODE;
    this.details = details;
  }
}

export class AlreadyExistsException extends Error {
  static MESSAGE = "Already Exists";
  static CODE = 409;

  constructor(details = null) {
    super(AlreadyExistsException.MESSAGE);
    this.name = "AlreadyExistsException";
    this.code = AlreadyExistsException.CODE;
    this.details = details;
  }
}
