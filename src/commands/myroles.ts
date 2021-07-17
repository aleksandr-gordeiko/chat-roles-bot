import { Context } from 'telegraf';
import { getChatRoles } from '../db';
import { joinReplyCodes } from '../reply_codes';

const myroles = async (ctx: Context): Promise<void> => {
  const userId: number = ctx.from.id;
  const chatId: number = ctx.chat.id;

  await getChatRoles(chatId, userId, true)
    .then(async (res) => {
      if (res.length === 0) {
        ctx.state.reply_code = joinReplyCodes.NO_ROLES_IN_CHAT;
        return;
      }

      let repl = 'Your roles:\n';
      for (const role of res) {
        repl += `${role}\n`;
      }

      await ctx.reply(repl, { reply_to_message_id: ctx.message.message_id });
    });
};

export default myroles;
