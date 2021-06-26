import { Context } from 'telegraf';

import { deleteUser } from '../db';

const unregister = async (ctx: Context): Promise<void> => {
  const user = ctx.from;
  await deleteUser(user)
    .then((res_code: string) => { ctx.state.reply_code = res_code; })
    .catch((err_code: string) => { ctx.state.reply_code = err_code; });
};

export default unregister;
