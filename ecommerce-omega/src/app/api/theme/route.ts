// src/app/api/theme/route.ts
import { NextResponse } from 'next/server';

const theme = {
  bg1:     '#F3F4F6',
  bg2:     '#111827',
  text1:   '#1F2937',
  text2:   '#E5E7EB',
  border:  '#FDBA74',
  border2: '#FB923C',
};

export async function GET() {
  return NextResponse.json(theme, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
