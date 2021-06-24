import {leave_reply_codes} from "../reply_codes";
import {remove_user_from_role} from "../db";

const leave = async (ctx) => {
    const user = ctx.from;
    const role = ctx.message.text.split(" ").slice(1).join("");

    if (role === "") {
        ctx.reply_code = leave_reply_codes.ERROR;
        return;
    }

    await remove_user_from_role(user, role)
        .then(res_code => {ctx.reply_code = res_code})
        .catch(err_code => {ctx.reply_code = err_code});
}

export default leave;