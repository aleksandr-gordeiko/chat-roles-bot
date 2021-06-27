import { joinReplyCodes } from '../reply_codes';
import { addUserIdToRole } from '../db';

const join = async (ctx) => {
  const user = ctx.from;
  const role = ctx.message.text.split(' ').slice(1).join('_');

  if (role === '') {
    ctx.state.reply_code = joinReplyCodes.INVALID_ARGUMENT;
    return;
  }

  await addUserIdToRole(user, role)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default join;
