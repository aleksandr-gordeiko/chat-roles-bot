import { Context } from 'telegraf';
import { User } from 'typegram';

import { addOrUpdateUser } from '../db';

const register = async (ctx: Context): Promise<void> => {
  const user: User = ctx.from;
  const chatId: number = ctx.chat.id;
  await addOrUpdateUser(user, chatId)
    .then((res_code: string) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default register;
