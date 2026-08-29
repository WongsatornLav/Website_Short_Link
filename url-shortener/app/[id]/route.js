import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const originalUrl = await kv.get(id);

    if (originalUrl) {
      return NextResponse.redirect(new URL(originalUrl));
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}