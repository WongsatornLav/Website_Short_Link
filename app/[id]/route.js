import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const originalUrl = await redis.get(id);

    if (originalUrl) {
      return NextResponse.redirect(new URL(originalUrl));
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Redirect Error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}