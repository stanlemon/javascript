export function fetchApi<T, P>(
  url: string,
  token: string | null = null,
  method = "get",
  data?: P
): Promise<T> {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
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
    });
}

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
