import {get_all_users} from "../db";
import {show_reply_codes} from "../reply_codes";

const participants = async (ctx) => {
    await get_all_users()
        .then((res: string[] | string) => {
            if (res === show_reply_codes.NO_USERS_FOUND){
                ctx.reply_code = res;
                return;
            }

            if (Array.isArray(res)) {
                let reply = "Registered users by now:";
                res.forEach((value, index) => {
                    reply += `\n${index + 1}. ${value}`;
                })
                ctx.reply(reply);
            }
        });
}

export default participants;