import { Context } from 'telegraf';
import { Message } from 'typegram';
import { getUserIdsAndUsernamesFromRole } from './db';
import { getRoleReplyCodes } from './reply_codes';

const onDoubleAt = async (ctx: Context): Promise<void> => {
  const chatId: number = ctx.chat.id;
  const msg: string = (ctx.message as Message.TextMessage).text;
  const wordArray: string[] = msg.split(' ');

  const roles: string[] = [];
  for (const word of wordArray) {
    if (word.slice(0, 2) === '@@') roles.push(word.slice(2));
  }
  if (roles.length === 0) return;

  const users = {};
  for (const role of roles) {
    await getUserIdsAndUsernamesFromRole(role, chatId)
      .then(async (res: string | Object) => {
        if (res === getRoleReplyCodes.COLLECTION_EMPTY || res === getRoleReplyCodes.ROLE_DOES_NOT_EXIST) return;

        if (typeof res === 'object') {
          for (const id in res) {
            if (!Object.prototype.hasOwnProperty.call(users, id)) users[id] = res[id];
          }
        }
      });
  }

  let pings: string = '';
  for (const id in users) {
    pings += `[@${users[id]}](tg://user?id=${id}) `;
  }

  if (pings.length === 0) {
    ctx.state.reply_code = getRoleReplyCodes.COLLECTION_EMPTY;
    return;
  }
  await ctx.reply(pings, { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id });
};

export default onDoubleAt;
