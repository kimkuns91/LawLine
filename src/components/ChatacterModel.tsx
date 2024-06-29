'use client';

import { cn } from '@/utils/style';
import { AIModel } from '@prisma/client';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ChatacterModelProps {
  userId?: string;
  aiModel: AIModel;
}

const ChatacterModel: React.FC<ChatacterModelProps> = ({ userId, aiModel }) => {
  const router = useRouter();
  const createCharacterRoom = async () => {
    const result = await axios.post('/api/ai/room', {
      characterName: aiModel.name,
      characterId: aiModel.id,
      userId,
    });
    const newRoomId = result.data.id;
    router.push(`/ai/chat/c/${newRoomId}`);
  };

  return (
    <div
      className={cn('flex gap-4 border-b border-slate-600 py-6')}
      onClick={createCharacterRoom}
    >
      <Image
        className="rounded-md"
        src={aiModel.profileImg}
        alt={aiModel.name}
        width={110}
        height={110}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold">{aiModel.name}</h3>
        <p className="text-sm">{aiModel.description}</p>
      </div>
    </div>
  );
};
export default ChatacterModel;
