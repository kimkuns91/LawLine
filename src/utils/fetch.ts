'use server';

import prisma from '@/libs/prisma';

const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

export const verifyRoomID = async (roomId: string) => {
  try {
    if (!isValidObjectId(roomId)) {
      return null;
    }

    const room = await prisma.aIChatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return null;
    }

    return room;
  } catch (error) {
    return null;
  }
};

export async function getAIModels() {
  'use server';
  try {
    const aiModels = await prisma.aIModel.findMany();
    return aiModels;
  } catch (error) {
    console.error('getAIModels error : ', error);
    return [];
  }
}

export async function fetchModel(characterId: string) {
  'use server';
  try {
    if (!isValidObjectId(characterId)) {
      return null;
    }

    const model = await prisma.aIModel.findUnique({
      where: { id: characterId },
    });

    if (!model) {
      return null;
    }

    return model;
  } catch (error) {
    return null;
  }
}
