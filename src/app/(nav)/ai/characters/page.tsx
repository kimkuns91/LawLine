import ChatacterModel from '@/components/ChatacterModel';
import { authOptions } from '@/libs/next-auth';
import { getAIModels } from '@/utils/fetch';
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
  const aiModels = await getAIModels();
  const session = await getServerSession(authOptions);
  return (
    <div className="size-full flex flex-col gap-4 items-center justify-center py-24">
      <>
        <h2 className="text-center text-3xl font-bold">AI 캐릭터</h2>
        <p className="text-center text-base font-semibold">
          다양한 AI 캐릭터들에게 법률 상담을 받아보세요
        </p>
        <div className="flex flex-col gap-4">
          {aiModels &&
            aiModels.map((aiModel, index) => (
              <ChatacterModel
                key={index}
                userId={session?.user.id}
                aiModel={aiModel}
              />
            ))}
        </div>
      </>
    </div>
  );
}
