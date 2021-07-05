import { Telegraf } from 'telegraf';
import { connect, closeConnection } from './db';

import reply from './middlewares/reply';
import error from './middlewares/error';

import ping from './commands/ping';
import register from './commands/register';
import unregister from './commands/unregister';
import participants from './commands/participants';
import join from './commands/join';
import leave from './commands/leave';
import inline from './inline';

const bot: Telegraf = new Telegraf(process.env.BOT_API_TOKEN);

bot.use(reply);
bot.use(error);

bot.command('ping', ping);
bot.command('register', register);
bot.command('unregister', unregister);
bot.command('participants', participants);
bot.command('join', join);
bot.command('leave', leave);

bot.on('inline_query', inline);

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

connect()
  .then(() => bot.launch())
  .catch((err) => console.log(err));
