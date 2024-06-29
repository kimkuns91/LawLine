'use client';

import { AIChatRoom, AIModel } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

import { continueConversationWithAiModel } from '@/libs/openai';
import { cn } from '@/utils/style';
import { CoreMessage } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import CharacterMessage from './CharacterMessage';
import Spinner from './Spinner';

interface CharacterChatRoomProps {
  roomInfo: AIChatRoom;
  modelInfo: AIModel;
}

const CharacterChatRoom: React.FC<CharacterChatRoomProps> = ({
  roomInfo,
  modelInfo,
}) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(`/api/ai/room/${roomInfo.id}`);
        if (result.data.length === 0) {
          const greetingMessage: CoreMessage[] = [
            { content: modelInfo.greeting, role: 'assistant' },
          ];
          setMessages(greetingMessage);
          await axios.post('/api/ai/chat', {
            messages: { role: 'assistant', content: modelInfo.greeting },
            roomId: roomInfo.id,
          });
        } else {
          setMessages(result.data);
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomInfo.id]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      // 입력 값이 없으면 함수 종료
      return;
    }

    setIsSending(true); // 메시지 전송 상태로 설정

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];

    setMessages(newMessages);
    setInput('');

    const result = await continueConversationWithAiModel(
      modelInfo.prompt,
      newMessages,
      roomInfo.id
    );
    let finalContent = '';

    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: content as string,
        },
      ]);
      finalContent = content as string;
    }

    try {
      await axios.post('/api/ai/chat', {
        messages: { role: 'assistant', content: finalContent },
        roomId: roomInfo.id,
      });
      console.log('Messages saved to the server');
    } catch (error) {
      console.error('Error saving messages to the server:', error);
    }

    setIsSending(false); // 메시지 전송 완료 후 상태 초기화
  };

  if (loading)
    return (
      <div className="size-full flex items-center justify-center text-3xl">
        <Spinner colors="#01C027" />
      </div>
    );

  return (
    <div className={cn('size-full', 'flex flex-col relative')}>
      <div
        ref={chatContainerRef}
        className="scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6"
      >
        <div className="max-w-[800px] mx-auto px-28 py-6">
          {messages &&
            messages.map((m, i) => (
              <div key={i}>
                <CharacterMessage
                  character={modelInfo}
                  role={m.role}
                  content={m.content as string}
                />
              </div>
            ))}
        </div>
      </div>
      <form
        className="mb-8 w-full max-w-[800px] mx-auto px-28"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between rounded-full border border-slate-300 px-6 py-2 shadow-xl">
          <input
            className="flex-1 bg-transparent p-2 text-slate-900 placeholder:text-gray-500 focus:outline-none"
            value={input}
            placeholder="LawLine AI 봇에게 법률에 대해 물어보세요."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className={cn(
              'ml-4 p-2',
              isSending ? 'opacity-50 cursor-not-allowed' : 'text-slate-700'
            )}
            disabled={isSending || !input.trim()} // 메시지 전송 중이거나 입력 값이 없으면 비활성화
          >
            {isSending ? (
              <Spinner /> // 로딩 스피너 아이콘
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterChatRoom;
