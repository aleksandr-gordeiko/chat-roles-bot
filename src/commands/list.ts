import { Context } from 'telegraf';
import { Message } from 'typegram';
import { getUserIdsAndUsernamesFromRole } from '../db';
import { getRoleReplyCodes } from '../reply_codes';

const list = async (ctx: Context): Promise<void> => {
  const chatId: number = ctx.chat.id;
  const role = (ctx.message as Message.TextMessage).text
    .split(' ')
    .slice(1)
    .join('_');

  await getUserIdsAndUsernamesFromRole(role, chatId)
    .then(async (res) => {
      if (res === getRoleReplyCodes.COLLECTION_EMPTY
        || res === getRoleReplyCodes.ROLE_DOES_NOT_EXIST) {
        ctx.state.reply_code = res;
        return;
      }

      if (typeof res === 'object') {
        let repl = `Members of ${role}:\n`;
        for (const key in res) {
          repl += `${res[key]}\n`;
        }
        await ctx.reply(repl);
      }
    })
    .catch((err) => { throw new Error(err); });
};

export default list;
