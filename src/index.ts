import { Telegraf } from 'telegraf';
import { connectDB, closeConnection } from './db';

import reply from './middlewares/reply';
import error from './middlewares/error';
import rememberUser from './middlewares/remember_user';

import ping from './commands/ping';
import join from './commands/join';
import leave from './commands/leave';

const bot: Telegraf = new Telegraf(process.env.BOT_API_TOKEN);

bot.use(reply);
bot.use(error);
bot.use(rememberUser);

bot.command('ping', ping);
bot.command('join', join);
bot.command('leave', leave);

process.once('SIGINT', () => {
  closeConnection()
    .then(() => console.log('SIGINT occurred, exiting'))
    .catch(() => console.log('SIGINT occurred, exiting with no db connection closed'));
});
process.once('SIGTERM', () => {
  closeConnection()
    .then(() => console.log('SIGTERM occurred, exiting'))
    .catch(() => console.log('SIGTERM occurred, exiting with no db connection closed'));
});

connectDB()
  .then(() => bot.launch())
  .catch((err) => console.log(err));
