import { Context } from 'telegraf';

import { addOrUpdateUser } from '../db';

const register = async (ctx: Context): Promise<void> => {
  const user = ctx.from;
  await addOrUpdateUser(user)
    .then((res_code: string) => { ctx.state.reply_code = res_code; })
    .catch((err_code: string) => { ctx.state.reply_code = err_code; });
};

export default register;
