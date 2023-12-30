export function fetchApi<T, P>(
  url: string,
  token: string | null | undefined = null,
  method = "get",
  data?: P
): Promise<T> {
  return (
    fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Only send the authorization header if we have a bearer token
        ...(token ? { Authorization: `Bearer ${token ?? ""}` } : {}),
      },
      body: JSON.stringify(data),
    })
      // This allows us to have both the status code and the body
      .then((response) =>
        response.text().then((body) => ({
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body,
        }))
      )
      .then(({ ok, status, statusText, body }) => {
        if (!ok) {
          throw new ApiError(status, statusText, quietJSONParse(body));
        }

        return JSON.parse(body) as T;
      })
  );
}
/**
 * Parse JSON and eat any parse errors.
 * @param body text
 * @returns json or null
 */
function quietJSONParse<T>(body: string): T | null {
  try {
    return JSON.parse(body);
  } catch (err) {
    return null;
  }
}

export default fetchApi;

export class ApiError extends Error {
  #code: number;

  get code(): number {
    return this.#code;
  }

  #body: Record<string, unknown>;

  get body(): Record<string, unknown> {
    return this.#body;
  }

  constructor(
    code: number,
    message: string,
    body: Record<string, unknown> | null
  ) {
    super(message);
    this.#code = code;
    this.#body = body ?? {};
  }
}
