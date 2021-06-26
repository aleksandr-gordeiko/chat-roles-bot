import { deleteUser } from '../db';

const unregister = async (ctx) => {
  const user = ctx.from;
  await deleteUser(user)
    .then((res_code) => { ctx.reply_code = res_code; })
    .catch((err_code) => { ctx.reply_code = err_code; });
};

export default unregister;
