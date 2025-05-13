// src/app/api/theme/route.ts
import { NextResponse } from 'next/server';

const theme = {
  bg1:     '#F97316',
  bg2:     '#C2410C',
  text1:   '#F97316',
  text2:   '#C2410C',
  border:  '#FDBA74',
  border2: '#FED7AA',
};

export async function GET() {
  return NextResponse.json(theme, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
