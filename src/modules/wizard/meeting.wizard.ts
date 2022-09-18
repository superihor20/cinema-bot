import { Wizard, WizardStep, Ctx, Action, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { MeetService } from '../meet/meet.service';

@Wizard('meeting', {
  ttl: 60 * 5,
  enterHandlers: [],
  handlers: [],
  leaveHandlers: [],
})
export class MeetingWizard {
  constructor(private meetService: MeetService, @InjectBot() private bot: Telegraf<Context>) {}

  @WizardStep(1)
  async startMessage(@Ctx() ctx: any) {
    await ctx.reply('Enter invitation message');

    ctx.wizard.next();
  }

  @WizardStep(2)
  async getInivitation(@Ctx() ctx: any) {
    const invitation = (ctx.message as any)?.text;

    if (!invitation) {
      await ctx.reply('Please enter the invitation');

      ctx.wizard.back();
      ctx.wizard.next();

      return;
    }

    const activityButtons = [
      [
        { callback_data: `SEND`, text: 'Send!' },
        { callback_data: `CANCEL`, text: 'Cancel' },
      ],
    ];
    const selectedBadge = await this.meetService.getBadgeById(+(ctx.scene.state as any).badgeId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.state.invitation = invitation;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.state.selectedBadge = selectedBadge;
    ctx.reply(
      `This message will be send to the all user that have "${selectedBadge.name}" badge: \n${invitation}`,
      {
        reply_markup: {
          inline_keyboard: activityButtons,
        },
      },
    );
  }

  @Action('CANCEL')
  async repeat(@Ctx() ctx: any) {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
    await ctx.reply('Meeting was canceled :(');
  }

  @Action('SEND')
  async leave(@Ctx() ctx: any) {
    const usersToSendMessage = await this.meetService.findUsersWithBadge(+ctx.scene.state.badgeId);

    const message = `${ctx.scene.state.invitation}\n\nBadge - ${
      ctx.scene.state.selectedBadge.name
    }\n\nInvited people:\n${usersToSendMessage
      .map((user) => {
        if (user.telegramId === ctx.from.id) {
          return `🤔 ${user.fullName}`;
        }

        return `🤔 ${user.fullName}`;
      })
      .join(';\n')}.`;

    // const isItMyInvitation =
    //   usersToSendMessage.filter((user) => user.telegramId === ctx.from.id).length > 0;

    const messages = await Promise.all([
      ...usersToSendMessage.map((user) =>
        this.bot.telegram.sendMessage(
          user.telegramId,
          message,
          // isItMyInvitation
          //   ? {}
          //   :
          {
            disable_notification: true,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    callback_data: `INVITATION_RESULT_ACCEPT_${user.telegramId}`,
                    text: 'Yes',
                  },
                  {
                    callback_data: `INVITATION_RESULT_REJECT_${user.telegramId}`,
                    text: 'No',
                  },
                ],
              ],
            },
          },
        ),
      ),
    ]);

    await Promise.all([
      ctx.answerCbQuery(),
      ctx.reply('Message sent, have a good time :)'),
      ctx.scene.leave(),
    ]);
  }
}
