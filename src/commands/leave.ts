import { Context, Markup } from 'telegraf';
import { Message, User } from 'typegram';

import { leaveReplyCodes } from '../reply_codes';
import { getChatRoles, removeUserFromRole } from '../db';

const leave = async (ctx: Context) => {
  const user: User = ctx.from;
  const chatId: number = ctx.chat.id;
  let role;
  if (ctx.state.roleChosen) {
    role = ctx.state.roleChosen;
    await ctx.deleteMessage();
  } else {
    role = (ctx.message as Message.TextMessage).text.split(' ')
      .slice(1)
      .join('_');
  }

  if (role === '') {
    await getChatRoles(chatId, user.id, true)
      .then(async (res) => {
        if (res.length === 0) ctx.state.reply_code = leaveReplyCodes.USER_DOES_NOT_HAVE_ROLES;

        const buttons = [];
        for (const resRole of res) {
          buttons.push([Markup.button.callback(resRole, `leave-${resRole}`)]);
        }

        await ctx.reply('Choose a role to leave', Markup.inlineKeyboard(buttons));
      });
    return;
  }

  await removeUserFromRole(user, role, chatId)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default leave;
