import { leaveReplyCodes } from '../reply_codes';
import { removeUserFromRole } from '../db';

const leave = async (ctx) => {
  const user = ctx.from;
  const role = ctx.message.text.split(' ').slice(1).join('_');

  if (role === '') {
    ctx.state.reply_code = leaveReplyCodes.USER_NOT_IN_COLLECTION;
    return;
  }

  await removeUserFromRole(user, role)
    .then((res_code) => { ctx.state.reply_code = res_code; })
    .catch((err) => { throw new Error(err); });
};

export default leave;
