'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { cn } from '@/utils/style';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

interface ChatIntroProps {
  userId?: string;
}

const ChatIntro: React.FC<ChatIntroProps> = ({ userId }) => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const storedInput = sessionStorage.getItem(
      'CHAT_HOME_INPUT_STATE_SESSION_KEY'
    );
    if (storedInput) {
      setInput(storedInput);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    const inputValue = textarea.value;
    setInput(inputValue);
    sessionStorage.setItem('CHAT_HOME_INPUT_STATE_SESSION_KEY', inputValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const result = await axios.post('/api/ai/room', { input, userId });
    const newRoomId = result.data.id;
    router.push(`/ai/chat/u/${newRoomId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <div
      className={cn(
        'size-full',
        'max-w-[800px] mx-auto',
        'flex flex-col relative',
        'px-28 py-6'
      )}
    >
      <div className="flex flex-1 items-center justify-center flex-col gap-6 overflow-y-auto px-4 py-6">
        <h2 className="font-bold text-3xl mb-8">
          로라인 봇에게 법률 상담을 해보세요.
        </h2>
        <form className="mb-8 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col rounded-2xl border border-slate-300 px-4 py-4 shadow-xl">
            <textarea
              className="flex-1 bg-transparent p-2 text-slate-900 placeholder:text-gray-500 focus:outline-none resize-none overflow-hidden"
              style={{ maxHeight: 'calc(1.5em * 8)', lineHeight: '1.5em' }}
              value={input}
              placeholder="LawLine AI 봇에게 법률에 대해 물어보세요."
              onChange={(e) => handleInputChange(e)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-end justify-end">
              <button
                type="submit"
                className={cn(
                  'ml-4 p-2 cursor-pointer transition-all duration-200 hover:opacity-60',
                  'text-sm bg-[#00C127] rounded-full',
                  isSending ? 'opacity-50 cursor-not-allowed' : 'text-slate-100'
                )}
                disabled={isSending || !input.trim()} // 메시지 전송 중이거나 입력 값이 없으면 비활성화
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatIntro;
