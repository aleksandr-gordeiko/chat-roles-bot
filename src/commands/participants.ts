import { Context } from 'telegraf';

import { getAllUsers } from '../db';
import { showReplyCodes } from '../reply_codes';

const participants = async (ctx: Context): Promise<void> => {
  await getAllUsers()
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
    });
};

export default participants;
