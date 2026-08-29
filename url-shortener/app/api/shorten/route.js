import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const { url, customId } = await request.json();
    
    // ตรวจสอบว่าใส่ URL ถูกต้องหรือไม่
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return NextResponse.json({ error: 'กรุณาใส่ลิงก์ที่ขึ้นต้นด้วย http:// หรือ https://' }, { status: 400 });
    }

    // กำหนด ID: ใช้ชื่อ Custom หรือสุ่มตัวอักษร 6 ตัว
    const id = customId?.trim() || Math.random().toString(36).substring(2, 8);

    // ตรวจสอบว่ามีชื่อนี้ใน Database แล้วหรือยัง
    const exists = await kv.get(id);
    if (exists) {
      return NextResponse.json({ error: 'ชื่อ Custom นี้มีคนใช้แล้ว โปรดเปลี่ยนใหม่' }, { status: 400 });
    }

    // บันทึกลิงก์ลง Database (KV)
    await kv.set(id, url);

    return NextResponse.json({ shortUrl: `/${id}` });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 });
  }
}