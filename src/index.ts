export function handleRequest(request) {
  const url = new URL(request.url);
  const response = await fetch(url.href);
  return response;
}
