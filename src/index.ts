import {Telegraf} from "telegraf";
import {connect, close_connection} from "./db";

import reply from "./middlewares/reply";
import error from "./middlewares/error";

import ping from "./commands/ping";
import register from "./commands/register";
import unregister from "./commands/unregister";
import participants from "./commands/participants";
import join from "./commands/join";
import leave from "./commands/leave";


const bot = new Telegraf(process.env.BOT_API_TOKEN);

bot.use(reply);
bot.use(error);

bot.command("ping", ping);
bot.command("register", register);
bot.command("unregister", unregister);
bot.command("participants", participants);
bot.command("join", join);
bot.command("leave", leave);

process.once('SIGINT', () => {
    close_connection()
        .then(() => console.log("SIGINT occurred, exiting"))
        .catch(() => console.log("SIGINT occurred, exiting with no db connection closed"))
})
process.once('SIGTERM', () => {
    close_connection()
        .then(() => console.log("SIGTERM occurred, exiting"))
        .catch(() => console.log("SIGTERM occurred, exiting with no db connection closed"))
})

connect()
    .then(() => bot.launch())
    .catch(err => console.log(err));