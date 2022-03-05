import { formatInput } from "./index.js";
import { formatOutput } from "./index.js";

export default asyncJsonHandler;

export function asyncJsonHandler(fn) {
  return async (req, res /*, next */) => {
    const input = {
      // For POST & PUT requests we'll use the body
      // For everything else, it's query string parameters
      ...(req.method === "POST" || req.method === "PUT"
        ? formatInput(req.body)
        : req.query || {}),
      // Always make sure the request parameters override everything else
      // eg. a param for 'id' is not overridden by a query string 'id' or 'req.body.id'
      ...req.params,
    };

    try {
      const output = await fn(input);

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

      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        // eslint-disable-next-line no-console
        console.error(ex);

        res.status(500).json({ error: formatError(ex) });
      } else {
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  };
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
