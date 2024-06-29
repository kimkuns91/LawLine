import { cn } from '@/utils/style';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { MdHome } from 'react-icons/md';
import { RiRobot2Line } from 'react-icons/ri';
import CustomIconLink from './CustomIconLink';
import LoginButton from './LoginButton';
import RoomList from './RoomList';
import UserController from './UserController';

interface SideBarProps {
  isSidebarVisible: boolean;
}

export default function SideBar({ isSidebarVisible }: SideBarProps) {
  const { data: session, status } = useSession();

  return (
    <div
      className={cn(
        'fixed left-0 top-0',
        'h-full',
        'transition-transform duration-300 ease-in-out',
        'bg-white text-black',
        isSidebarVisible ? 'translate-x-0' : '-translate-x-full',
        'flex flex-col'
      )}
      style={{ width: '260px' }}
    >
      <div className={cn('px-2 py-6', 'border-b border-slate-300')}>
        <Link href="/">
          <Image
            className="pl-4 mb-6"
            src="/images/Logo.png"
            alt="LawLine Logo"
            width={160}
            height={0}
          />
        </Link>
        <CustomIconLink
          href="/ai"
          icon={<MdHome className="text-lg" />}
          text="채팅 홈"
        />
        <CustomIconLink
          href="/ai/characters"
          icon={<RiRobot2Line className="text-lg" />}
          text="AI 캐릭터 홈"
        />
      </div>
      <div className="p-4 px-6">
        <p className="text-sm font-semibold">대화 내역</p>
      </div>
      <RoomList session={session} status={status} />
      {status === 'authenticated' ? (
        <UserController session={session} />
      ) : (
        <LoginButton status={status} />
      )}
    </div>
  );
}
