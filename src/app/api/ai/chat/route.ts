import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, roomId } = body;

    // console.log('messages:', messages);
    // console.log('roomId:', roomId);

    const newMessage = await prisma.aIChatMessage.create({
      data: {
        roomId: roomId,
        role: messages.role,
        content: messages.content,
      },
    });

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}
