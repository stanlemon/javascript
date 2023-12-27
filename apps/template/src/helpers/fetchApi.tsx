export function fetchApi<T, P>(
  url: string,
  token: string,
  method = "get",
  data?: P
): Promise<T> {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return Promise.all([
        new Promise<Response>((resolve, reject) => {
          resolve(response);
        }),
        response.json() as Promise<T>,
      ]);
    })
    .then(([response, json]) => {
      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          json as Record<string, unknown>
        );
      }

      return json;
    });
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

  constructor(code: number, message: string, body: Record<string, unknown>) {
    super(message);
    this.#code = code;
    this.#body = body;
  }
}
