import { Context } from 'telegraf';
import { User } from 'typegram';

import { deleteUser } from '../db';

const unregister = async (ctx: Context): Promise<void> => {
  const user: User = ctx.from;
  const chatId: number = ctx.chat.id;
  await deleteUser(user, chatId)
    .then((res_code: string) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default unregister;
