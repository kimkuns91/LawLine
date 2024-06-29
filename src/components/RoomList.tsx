import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/style';
import { AIChatRoom } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import Spinner from './Spinner';

interface RoomListProps {
  session: any;
  status: any;
}
const RoomList: React.FC<RoomListProps> = ({ session, status }) => {
  const router = useRouter();
  const pathName = usePathname();

  const [roomList, setRoomList] = useState<AIChatRoom[] | null>(null);

  useEffect(() => {
    (async () => {
      if (session?.user.id) {
        try {
          const result = await axios.get(`/api/ai/chat/${session?.user.id}`);
          setRoomList(result.data);
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        }
      }
    })();
  }, [session, pathName]);

  if (status === 'loading') {
    return (
      <div
        className={cn('flex-1 overflow-y-auto px-6 py-2 flex justify-center')}
      >
        <Spinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <div className={cn('flex-1 overflow-y-auto px-6 py-2')}></div>;
  }

  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-2')}>
      <ul>
        {roomList &&
          roomList.map((room, i) => (
            <li
              key={i}
              className={cn(
                'my-2 p-2 cursor-pointer transition-colors duration-200 rounded',
                'flex justify-between items-center gap-4',
                pathName?.endsWith(room.id)
                  ? 'bg-[#5ECE6F]/20 text-white'
                  : 'hover:bg-gray-200'
              )}
              onClick={() => {
                if (room.characterId) {
                  router.push(`/ai/chat/c/${room.id}`);
                } else {
                  router.push(`/ai/chat/u/${room.id}`);
                }
              }}
            >
              <p className="text-slate-800 overflow-hidden whitespace-nowrap overflow-ellipsis">
                {room.title}
              </p>
              <p className="text-slate-400 text-sm">
                {format(new Date(room.createdAt), 'yy/MM/dd')}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RoomList;
