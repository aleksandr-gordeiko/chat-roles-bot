import { Context } from 'telegraf';
import { ChatMember } from 'typegram';
import { addEveryoneRole } from './db';

const onAdded = async (ctx: Context): Promise<void> => {
  const updatedChatMember: ChatMember = ctx.myChatMember.new_chat_member;
  if (updatedChatMember.user.username !== ctx.me) return;

  await addEveryoneRole(ctx.chat.id)
    .then();
};

export default onAdded;
