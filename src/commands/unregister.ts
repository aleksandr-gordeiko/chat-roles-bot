import {delete_user} from "../db";

const unregister = async (ctx) => {
    const user = ctx.from;
    await delete_user(user)
        .then(res_code => {ctx.reply_code = res_code})
        .catch(err_code => {ctx.reply_code = err_code});
}

export default unregister;