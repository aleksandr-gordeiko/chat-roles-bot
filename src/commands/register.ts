import {add_or_update_user} from "../db";

const register = async (ctx) => {
    const user = ctx.from;
    await add_or_update_user(user)
        .then(res_code => {ctx.reply_code = res_code})
        .catch(err_code => {ctx.reply_code = err_code});
};

export default register;