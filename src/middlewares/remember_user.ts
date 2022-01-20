import { Context } from 'telegraf';
import { addUserIdToRole, getUserIdsFromRole, saveOrUpdateUser } from '../db';

const rememberUser = async (ctx: Context, next: () => any): Promise<void> => {
  saveOrUpdateUser(ctx.from).then();

  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  const everyoneIds = await getUserIdsFromRole('everyone', chatId);
  if (typeof everyoneIds === 'string' || (typeof everyoneIds !== 'string' && !everyoneIds.includes(userId))) {
    await addUserIdToRole(ctx.from, 'everyone', chatId);
  }

  await next();
};

export default rememberUser;
