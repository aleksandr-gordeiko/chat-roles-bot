import { Telegraf } from 'telegraf';
import { closeConnection, connectDB } from './db';

import reply from './middlewares/reply';
import error from './middlewares/error';
import rememberUser from './middlewares/remember_user';

import ping from './commands/ping';
import join from './commands/join';
import leave from './commands/leave';
import myroles from './commands/myroles';
import roles from './commands/roles';
import findDoubleAtAndReact from './onDoubleAt';
import onAdded from './onAdded';

const bot: Telegraf = new Telegraf(process.env.BOT_API_TOKEN);

bot.use(reply);
bot.use(error);
bot.use(rememberUser);

bot.command('ping', ping);
bot.command('join', join);
bot.command('leave', leave);
bot.command('myroles', myroles);
bot.command('roles', roles);
bot.on('text', findDoubleAtAndReact);
bot.on('my_chat_member', onAdded);

bot.action(/^[join]+(-[a-z]+)?$/, async (ctx) => {
  ctx.answerCbQuery();
  ctx.state.roleChosen = ctx.match[1].split('-')[1];
  return join(ctx);
});

bot.action(/^[leav]+(-[a-z]+)?$/, async (ctx) => {
  ctx.answerCbQuery();
  ctx.state.roleChosen = ctx.match[1].split('-')[1];
  return leave(ctx);
});

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
