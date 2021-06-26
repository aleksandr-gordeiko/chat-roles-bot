import { joinReplyCodes } from '../reply_codes';
import { addUserIdToRole } from '../db';

const join = async (ctx) => {
  const user = ctx.from;
  const role = ctx.message.text.split(' ').slice(1).join('');

  if (role === '') {
    ctx.reply_code = joinReplyCodes.INVALID_ARGUMENT;
    return;
  }

  await addUserIdToRole(user, role)
    .then((res_code) => { ctx.reply_code = res_code; })
    .catch((err_code) => { ctx.reply_code = err_code; });
};

export default join;
