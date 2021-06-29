import { Context } from 'telegraf';
import { Message, User } from 'typegram';

import { joinReplyCodes } from '../reply_codes';
import { addUserIdToRole } from '../db';

const join = async (ctx: Context) => {
  const user: User = ctx.from;
  const chatId: number = ctx.chat.id;
  const role: string = (ctx.message as Message.TextMessage).text.split(' ').slice(1).join('_');

  if (role === '') {
    ctx.state.reply_code = joinReplyCodes.INVALID_ARGUMENT;
    return;
  }

  await addUserIdToRole(user, role, chatId)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default join;
