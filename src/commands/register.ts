import { Context } from 'telegraf';
import { User } from 'typegram';

import { addOrUpdateUser } from '../db';

const register = async (ctx: Context): Promise<void> => {
  const user: User = ctx.from;
  await addOrUpdateUser(user)
    .then((res_code: string) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default register;
