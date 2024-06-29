import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const modelId = params.modelId;

    const model = await prisma.aIModel.findUnique({
      where: {
        id: modelId,
      },
    });

    // console.log('formattedMessages:', formattedMessages);
    return NextResponse.json(model, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}
