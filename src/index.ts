export function handleRequest(request) {
  // Example optimized code to reduce recursive operations and complex computations
  const url = new URL(request.url);
  const response = await fetch(url.href);
  return response;
}