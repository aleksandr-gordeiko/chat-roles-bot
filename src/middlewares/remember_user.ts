import { Context } from 'telegraf';
import { saveOrUpdateUser } from '../db';

const rememberUser = async (ctx: Context, next: () => any): Promise<void> => {
  saveOrUpdateUser(ctx.from).then();
  await next();
};

export default rememberUser;
