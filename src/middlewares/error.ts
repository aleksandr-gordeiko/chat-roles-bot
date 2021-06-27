import { Context } from 'telegraf';

const error = async (ctx: Context, next: () => any) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    await ctx.reply('An internal error occurred');
  }
};

export default error;
