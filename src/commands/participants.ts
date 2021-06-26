import { getAllUsers } from '../db';
import { showReplyCodes } from '../reply_codes';

const participants = async (ctx) => {
  await getAllUsers()
    .then((res: string[] | string) => {
      if (res === showReplyCodes.NO_USERS_FOUND) {
        ctx.reply_code = res;
        return;
      }

      if (Array.isArray(res)) {
        let reply = 'Registered users by now:';
        res.forEach((value, index) => {
          reply += `\n${index + 1}. ${value}`;
        });
        ctx.reply(reply);
      }
    });
};

export default participants;
