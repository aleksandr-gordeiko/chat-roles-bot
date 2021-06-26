const reply = async (ctx, next) => {
  ctx.reply_code = null;
  await next();

  // ctx.reply(`@${ctx.from.username}`, { parse_mode: 'MarkdownV2' });

  if (ctx.reply_code !== null) { ctx.reply(ctx.reply_code); }
};

export default reply;
