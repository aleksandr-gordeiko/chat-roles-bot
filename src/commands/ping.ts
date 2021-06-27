import { Context } from 'telegraf';
import { getUserIdsAndUsernamesFromRole } from '../db';
import { getRoleReplyCodes } from '../reply_codes';

const ping = async (ctx: Context): Promise<void> => {
  const user = ctx.from.username;
  const args: string[] = ctx.message.toString().split(' ');
  const role: string = args[1];
  const message: string = args.slice(2).join(' ');

  await getUserIdsAndUsernamesFromRole(role)
    .then((res: string | Object) => {
      if (res === getRoleReplyCodes.COLLECTION_EMPTY
        || res === getRoleReplyCodes.COLLECTION_DOES_NOT_EXIST) {
        ctx.state.res_code = res;
        return;
      }

      if (typeof res === 'object') {
        let pings: string = '';
        for (const id in res) {
          pings += `[${res[id]}](tg://user?id=${id}) `;
        }
        ctx.reply(`${user}:\n${message}\n${pings}`, { parse_mode: 'MarkdownV2' });
      }
    });
};

export default ping;
