import { getUserIdsAndUsernamesFromRole } from '../db';
import { getRoleReplyCodes } from '../reply_codes';

const ping = async (ctx): Promise<void> => {
  const user = ctx.from.username;
  const args: string[] = ctx.message.text.split(' ');
  const role: string = args[1];
  const message: string = args.slice(2).join(' ');

  await getUserIdsAndUsernamesFromRole(role)
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
        const reply = `${user}:\n${message}\n${pings}`;
        await ctx.reply(reply, { parse_mode: 'Markdown' });
      }
    })
    .catch((err) => { throw new Error(err); });
};

export default ping;
