import ChatRoom from '@/components/ChatRoom';
import { authOptions } from '@/libs/next-auth';
import { verifyRoomID } from '@/utils/fetch';
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

  if (roomInfo === null) {
    return notFound();
  }

  console.log('roomInfo:', roomInfo);
  return <ChatRoom roomInfo={roomInfo} />;
}
