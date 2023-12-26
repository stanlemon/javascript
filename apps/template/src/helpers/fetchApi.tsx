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
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

export default fetchApi;
