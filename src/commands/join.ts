import {join_reply_codes} from "../reply_codes";
import {add_user_id_to_role} from "../db";

const join = async (ctx) => {
    const user = ctx.from;
    const role = ctx.message.text.split(" ").slice(1).join("");

    if (role === "") {
        ctx.reply_code = join_reply_codes.INVALID_ARGUMENT;
        return;
    }

    await add_user_id_to_role(user, role)
        .then(res_code => {ctx.reply_code = res_code})
        .catch(err_code => {ctx.reply_code = err_code});
}

export default join;