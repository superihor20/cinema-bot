import { Wizard, WizardStep, Ctx } from 'nestjs-telegraf';

import { users } from '../../mock/users';

@Wizard('auth', {
  ttl: 60 * 5,
  enterHandlers: [],
  handlers: [],
  leaveHandlers: [],
})
export class AuthWizard {
  @WizardStep(1)
  async join(@Ctx() ctx: any) {
    await ctx.reply('Enter the email that you use in Map app');

    ctx.wizard.next();
  }

  @WizardStep(2)
  async getEmail(@Ctx() ctx: any) {
    const userEmail = (ctx.message as any)?.text;

    if (!userEmail) {
      await ctx.reply('Please enter message with email');

      ctx.wizard.back();
      ctx.wizard.next();

      return;
    }

    // TODO: find user in DB with entered email
    const findUser = users.find((user) => user.email === userEmail);

    if (!findUser) {
      await ctx.reply('User with email not found');

      ctx.wizard.back();
      ctx.wizard.next();

      return;
    }

    //TODO: need to update user in DB, add telegramId (ctx.message.from.id)

    await Promise.all([ctx.reply('Thanks!'), ctx.scene.leave()]);
  }
}
