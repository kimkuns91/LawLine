import { fetchModel, verifyRoomID } from '@/utils/fetch';

import CharacterChatRoom from '@/components/CharacterChatRoom';
import { authOptions } from '@/libs/next-auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    roomId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const roomInfo = await verifyRoomID(params.roomId);
  const modelInfo = await fetchModel(roomInfo?.characterId!);

  if (roomInfo === null || modelInfo === null) {
    return notFound();
  }

  return <CharacterChatRoom roomInfo={roomInfo} modelInfo={modelInfo} />;
}
