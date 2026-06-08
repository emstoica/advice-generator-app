// functions/api/quote.js

const ALLOWED_ORIGINS = [
  "https://localhost:3000",
  "http://localhost:3000",
  "https://advice-generator-app-eu6.pages.dev",
  "https://emanuelstoica.com"
];

const MAX_REQUESTS_PER_DAY = 20;

export async function onRequest(context) {
  const { request, env } = context;

  try {
    const origin = request.headers.get("Origin");

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    const allowedOrigin = origin || ALLOWED_ORIGINS[0];

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // Rate limiting
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const today = new Date().toISOString().slice(0, 10);
    const key = `${ip}_${today}`;

    const count =
      parseInt(await env.RATE_LIMIT_KV.get(key)) || 0;

    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "en";

    const RATE_LIMIT_MESSAGES = {
      en: "It seems like you were looking for too much motivation! Come back later...",
      ro: "Se pare că ai căutat prea multă motivație! Revino mai târziu...",
      fr: "Il semble que tu cherchais trop de motivation ! Reviens plus tard...",
      es: "¡Parece que buscabas demasiada motivación! Vuelve más tarde..."
    };

    if (count >= MAX_REQUESTS_PER_DAY) {
      return Response.json(
        {
          quote: RATE_LIMIT_MESSAGES[lang] || RATE_LIMIT_MESSAGES.en,
          author: "",
          lang
        },
        {
          headers: {
            "Access-Control-Allow-Origin": allowedOrigin
          }
        }
      );
    }

    const result = await env.DB
      .prepare(`
        SELECT quote, author, lang
        FROM quotes
        WHERE lang = ?
        ORDER BY RANDOM()
        LIMIT 1
      `)
      .bind(lang)
      .first();

    await env.RATE_LIMIT_KV.put(
      key,
      String(count + 1),
      {
        expirationTtl: 86400
      }
    );

    if (!result) {
      return Response.json(
        {
          error: `No quote found for language: ${lang}`
        },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": allowedOrigin
          }
        }
      );
    }

    return Response.json(result, {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin
      }
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong. Please try again later."
      },
      {
        status: 500
      }
    );
  }
}