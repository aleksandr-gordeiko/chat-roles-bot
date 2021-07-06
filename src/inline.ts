import { Context } from 'telegraf';
import { InlineQueryResultArticle } from 'typegram';

import { getUserIdsAndUsernamesFromRole } from './db';
import { getRoleReplyCodes } from './reply_codes';

const inline = async (ctx: Context): Promise<void> => {
  const chatType: string = ctx.inlineQuery.chat_type;
  if (chatType !== 'group' && chatType !== 'supergroup') return;

  const args: string[] = ctx.inlineQuery.query.split(' ');
  const role: string = args[0];
  const message: string = args.slice(1).join(' ');

  getUserIdsAndUsernamesFromRole(role, chatId)
    .then(async (res: string | Object) => {
      if (res === getRoleReplyCodes.COLLECTION_EMPTY
        || res === getRoleReplyCodes.ROLE_DOES_NOT_EXIST) {
        ctx.state.reply_code = res;
        return;
      }

      if (typeof res === 'object') {
        let pings: string = '';
        for (const id in res) {
          pings += `[@${res[id]}](tg://user?id=${id}) `;
        }
        const reply: string = `${message}\n${pings}`;

        const inlineRes: InlineQueryResultArticle[] = [{
          type: 'article',
          id: '1337',
          title: reply,
          input_message_content: {
            message_text: reply,
            parse_mode: 'Markdown',
          },
        }];

        await ctx.answerInlineQuery(inlineRes);
      }
    });
};

export default inline;
