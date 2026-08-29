import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const redis = Redis.fromEnv();

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