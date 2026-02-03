/**
 * Tap2 GamePay - Cloudflare Worker Entry Point
 *
 * Ultra-low latency payment processing for gaming
 */

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STORAGE: R2Bucket;
  JWT_SECRET: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  ENCRYPTION_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const ctxReq = new RequestContext(request, env, ctx);

    try {
      // CORS preflight
      if (request.method === 'OPTIONS') {
        return handleCORS();
      }

      // Route handling
      const url = new URL(request.url);
      const path = url.pathname;

      // Health check
      if (path === '/health' || path === '/') {
        return jsonResponse({
          status: 'ok',
          service: 'tap2-gamepay',
          version: '0.1.0',
          timestamp: new Date().toISOString(),
        });
      }

      // API routes
      if (path.startsWith('/v1/')) {
        return handleAPI(ctxReq);
      }

      // 404
      return jsonResponse({ error: 'Not Found' }, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse(
        {
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  },
};

async function handleAPI(ctx: RequestContext): Promise<Response> {
  const { request } = ctx;
  const url = new URL(request.url);
  const path = url.pathname;

  // Route matching
  if (path === '/v1/game/purchase' && request.method === 'POST') {
    return jsonResponse({ error: 'Not Implemented' }, 501);
  }

  if (path === '/v1/game/wallet/balance' && request.method === 'GET') {
    return jsonResponse({ error: 'Not Implemented' }, 501);
  }

  return jsonResponse({ error: 'Not Found' }, 404);
}

function handleCORS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

class RequestContext {
  constructor(
    public request: Request,
    public env: Env,
    public ctx: ExecutionContext
  ) {}

  get url(): URL {
    return new URL(this.request.url);
  }

  get method(): string {
    return this.request.method;
  }
}
