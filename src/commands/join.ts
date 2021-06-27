import { Context } from 'telegraf';

import { joinReplyCodes } from '../reply_codes';
import { addUserIdToRole } from '../db';

const join = async (ctx: Context) => {
  const user = ctx.from;
  const role = ctx.message.toString().split(' ').slice(1).join('_');

  if (role === '') {
    ctx.state.reply_code = joinReplyCodes.INVALID_ARGUMENT;
    return;
  }

  await addUserIdToRole(user, role)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err_code) => { ctx.state.reply_code = err_code; });
};

export default join;
