import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export async function POST(request) {
  try {
    const { url, customId } = await request.json();

    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return NextResponse.json({ error: 'กรุณาใส่ลิงก์ที่ขึ้นต้นด้วย http:// หรือ https://' }, { status: 400 });
    }

    const id = customId?.trim() || Math.random().toString(36).substring(2, 8);

    const exists = await redis.get(id);
    if (exists) {
      return NextResponse.json({ error: 'ชื่อ Custom นี้มีคนใช้แล้ว โปรดเปลี่ยนใหม่' }, { status: 400 });
    }

    await redis.set(id, url);

    return NextResponse.json({ shortUrl: `/${id}` });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ: ' + (error?.message || '') }, { status: 500 });
  }
}