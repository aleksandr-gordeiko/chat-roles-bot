import { addOrUpdateUser } from '../db';

const register = async (ctx) => {
  const user = ctx.from;
  await addOrUpdateUser(user)
    .then((res_code) => { ctx.reply_code = res_code; })
    .catch((err_code) => { ctx.reply_code = err_code; });
};

export default register;
