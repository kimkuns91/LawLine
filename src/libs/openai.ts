'use server';

import { CoreMessage, streamText } from 'ai';

import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import prisma from './prisma';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

function convertContentToString(content: any) {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if ('text' in part) {
          return part.text;
        }
        return ''; // 필요에 따라 다른 타입에 대한 처리를 추가할 수 있습니다.
      })
      .join(' ');
  }
  return ''; // 필요에 따라 다른 타입에 대한 처리를 추가할 수 있습니다.
}

export async function continueConversation(
  messages: CoreMessage[],
  roomId: string
) {
  'use server';

  const promptMessage: CoreMessage = {
    role: 'system',
    content:
      '1. 너의 이름은 로라인봇(LawLine Bot) 이며, 너는 한국 법률 전문가로 한국어로 유저의 질문에 대답한다. ' +
      '2. 유저가 질문을 하면, 질문에 구체적으로 답해준다. ' +
      '3. 판례가 있는 경우, 판례 예시를 들어준다. ',
  };

  const updatedMessages = [promptMessage, ...messages];

  await prisma.aIChatMessage.create({
    data: {
      roomId,
      role: 'user',
      content: convertContentToString(messages[messages.length - 1].content),
    },
  });

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: updatedMessages,
  });

  const stream = createStreamableValue(result.textStream);

  return stream.value;
}

export async function continueConversationWithAiModel(
  prompt: string,
  messages: CoreMessage[],
  roomId: string
) {
  'use server';

  const promptMessage: CoreMessage = {
    role: 'system',
    content:
      '1. 너는 한국 법률 전문가로 한국어로 유저의 질문에 대답한다.' +
      '2. 유저가 질문을 하면, 질문에 구체적으로 답해준다. ' +
      '3. 판례가 있는 경우, 판례 예시를 들어준다. ' +
      prompt,
  };

  const updatedMessages = [promptMessage, ...messages];

  await prisma.aIChatMessage.create({
    data: {
      roomId,
      role: 'user',
      content: convertContentToString(messages[messages.length - 1].content),
    },
  });

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: updatedMessages,
  });

  const stream = createStreamableValue(result.textStream);

  return stream.value;
}
