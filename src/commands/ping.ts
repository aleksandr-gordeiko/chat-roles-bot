import { Context } from 'telegraf';

const ping = async (ctx: Context): Promise<void> => {
  await ctx.reply('Ping command will be available soon');
};

export default ping;
