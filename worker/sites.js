// Sirve archivos estáticos y devuelve index.html para rutas de una SPA.
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (
      response.status !== 404 ||
      request.method !== "GET" ||
      !request.headers.get("accept")?.includes("text/html")
    ) {
      return response;
    }

    return env.ASSETS.fetch(new Request(new URL("/", request.url), request));
  },
};
