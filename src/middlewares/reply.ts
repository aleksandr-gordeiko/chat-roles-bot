import { Context } from 'telegraf';

const reply = async (ctx: Context, next: () => any) => {
  ctx.state.reply_code = null;
  await next();

  // ctx.reply(`@${ctx.from.username}`, { parse_mode: 'MarkdownV2' });

  if (ctx.state.reply_code !== null) { await ctx.reply(ctx.state.reply_code); }
};

export default reply;
