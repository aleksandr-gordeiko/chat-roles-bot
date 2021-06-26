import { leaveReplyCodes } from '../reply_codes';
import { removeUserFromRole } from '../db';

const leave = async (ctx) => {
  const user = ctx.from;
  const role = ctx.message.text.split(' ').slice(1).join('');

  if (role === '') {
    ctx.reply_code = leaveReplyCodes.ERROR;
    return;
  }

  await removeUserFromRole(user, role)
    .then((res_code) => { ctx.reply_code = res_code; })
    .catch((err_code) => { ctx.reply_code = err_code; });
};

export default leave;
