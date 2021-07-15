import { Context, Markup } from 'telegraf';
import { Message, User } from 'typegram';

import { addUserIdToRole, getChatRolesUserDoesNotHave } from '../db';
import { joinReplyCodes } from '../reply_codes';

const join = async (ctx: Context) => {
  const user: User = ctx.from;
  const chatId: number = ctx.chat.id;
  let role;
  if (ctx.state.roleChosen) {
    role = ctx.state.roleChosen;
  } else {
    role = (ctx.message as Message.TextMessage).text.split(' ')
      .slice(1)
      .join('_');
  }

  if (role === '') {
    await getChatRolesUserDoesNotHave(chatId, user.id)
      .then(async (res) => {
        if (res.length === 0) ctx.state.reply_code = joinReplyCodes.NO_ROLES_IN_CHAT;

        const buttons = [];
        for (const resRole of res) {
          buttons.push([Markup.button.callback(resRole, `join-${resRole}`)]);
        }

        await ctx.reply('Choose a role to join', Markup.inlineKeyboard(buttons));
      });
    return;
  }

  await addUserIdToRole(user, role, chatId)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default join;
