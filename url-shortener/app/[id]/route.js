import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // ค้นหา URL ต้นฉบับจาก ID ใน Database
    const originalUrl = await kv.get(id);

    if (originalUrl) {
      // หากพบข้อมูล ให้ Redirect ไปยังปลายทางทันที (HTTP 307 Temporary Redirect)
      return NextResponse.redirect(new URL(originalUrl));
    }

    // หากไม่พบ ID ในระบบ ให้ส่งกลับไปที่หน้าแรก
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}