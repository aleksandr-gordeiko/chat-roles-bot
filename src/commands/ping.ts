import { Context } from 'telegraf';
import { Message } from 'typegram';

import { getUserIdsAndUsernamesFromRole } from '../db';
import { getRoleReplyCodes } from '../reply_codes';

const ping = async (ctx: Context): Promise<void> => {
  const user: string = ctx.from.username;
  const chatId: number = ctx.chat.id;
  const args: string[] = (ctx.message as Message.TextMessage).text.split(' ');
  const role: string = args[1];
  const message: string = args.slice(2).join(' ');

  await getUserIdsAndUsernamesFromRole(role, chatId)
    .then(async (res: string | Object) => {
      if (res === getRoleReplyCodes.COLLECTION_EMPTY
        || res === getRoleReplyCodes.COLLECTION_DOES_NOT_EXIST) {
        ctx.state.reply_code = res;
        return;
      }

      if (typeof res === 'object') {
        let pings: string = '';
        for (const id in res) {
          pings += `[@${res[id]}](tg://user?id=${id}) `;
        }
        const reply: string = `${user}:\n${message}\n${pings}`;
        await ctx.reply(reply, { parse_mode: 'Markdown' });
      }
    })
    .catch((err) => { throw new Error(err); });
};

export default ping;
