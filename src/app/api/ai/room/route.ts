import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterName, characterId, input, userId } = body;
    // console.log('input:', input);
    // console.log('userId:', userId);

    const newRoom = await prisma.aIChatRoom.create({
      data: {
        title: characterId ? characterName + ' 채팅방' : input,
        characterId: characterId,
        userId: userId || 'unknown', // 필요한 경우 roomId를 동적으로 설정
      },
    });

    return NextResponse.json(newRoom, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}
