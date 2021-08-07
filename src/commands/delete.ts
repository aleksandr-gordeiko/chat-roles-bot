import { Context, Markup } from 'telegraf';
import { Message } from 'typegram';
import { deleteRole, getChatRoles } from '../db';
import { joinReplyCodes } from '../reply_codes';

const deletee = async (ctx: Context): Promise<void> => {
  const chatId: number = ctx.chat.id;
  // if ((await ctx.getChatMember(ctx.from.id)).status !== 'administrator') return;

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
    await getChatRoles(chatId)
      .then(async (res) => {
        if (res.length === 0) ctx.state.reply_code = joinReplyCodes.NO_ROLES_IN_CHAT;

        const buttons = [];
        for (const resRole of res) {
          buttons.push([Markup.button.callback(resRole, `delete-${resRole}`)]);
        }

        await ctx.reply('Choose a role to delete', Markup.inlineKeyboard(buttons));
      });
    return;
  }

  await deleteRole(role, chatId)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default deletee;
