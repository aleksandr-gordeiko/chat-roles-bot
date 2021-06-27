import { Context } from 'telegraf';

import { getAllUsernames } from '../db';
import { showReplyCodes } from '../reply_codes';

const participants = async (ctx: Context): Promise<void> => {
  await getAllUsernames()
    .then((res: string[] | string) => {
      if (res === showReplyCodes.NO_USERS_FOUND) {
        ctx.state.reply_code = res;
        return;
      }

      if (Array.isArray(res)) {
        let reply: string = 'Registered users by now:';
        res.forEach((value, index) => {
          reply += `\n${index + 1}. ${value}`;
        });
        ctx.reply(reply);
      }
    })
    .catch((err) => { throw new Error(err); });
};

export default participants;
