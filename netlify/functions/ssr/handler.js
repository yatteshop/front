// handler.js (Netlify Function for Vite SSR)

import { render } from "./entry-server.js";
import { PassThrough } from "stream";

// Netlify Function entry point
export async function handler(event, context) {
  const url = event.rawUrl || event.path;

  let didError = false;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: await new Promise((resolve, reject) => {
      const { pipe } = render(url, {
        onShellReady() {
          // Ready to start streaming
        },
        onShellError(err) {
          didError = true;
          reject(err);
        },
        onError(err) {
          didError = true;
          console.error(err);
        }
      });

      const stream = new PassThrough();
      pipe(stream);

      let html = "";
      stream.on("data", chunk => {
        html += chunk.toString();
      });
      stream.on("end", () => {
        resolve(
          `<!DOCTYPE html>\n${html}`
        );
      });
      stream.on("error", reject);
    }),
  };
}
