import ChatIntro from '@/components/ChatIntro';
import { authOptions } from '@/libs/next-auth';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'LawLine - AI Chat',
  description: 'LawLine AI와 대화해보세요.',
  icons: {
    icon: 'images/Favicon192.png',
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <ChatIntro userId={session?.user.id} />;
}
