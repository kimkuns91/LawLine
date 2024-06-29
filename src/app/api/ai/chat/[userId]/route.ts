import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    console.log('userId:', userId);

    const rooms = await prisma.aIChatRoom.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', // 최신 글 순으로 정렬
      },
    });

    console.log('rooms:', rooms);
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}
