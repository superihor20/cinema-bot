import { Injectable } from '@nestjs/common';
import { Update, Ctx, Command, Action, InjectBot } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';

import { getIdFromAction } from '../../helpers/getIdFromAction';
import { users } from '../../mock/users';

import { MeetService } from './meet.service';

const savedInvitationMessages = [
  {
    messageId: 1032,
    telegramId: 346333684,
    willGo: true,
  },
  {
    messageId: 1031,
    telegramId: 442894190,
    willGo: false,
  },
];

@Injectable()
@Update()
export class MeetCommand {
  constructor(private meetService: MeetService, @InjectBot() private bot: Telegraf<Context>) {}

  @Command('meet')
  async createMeeting(@Ctx() ctx: Scenes.SceneContext) {
    const userBadges = await this.meetService.getUserBadges(ctx);

    await ctx.reply('Choose meeting type: ', {
      reply_markup: {
        inline_keyboard: this.meetService.generateMeetingButtons(userBadges),
      },
    });
  }

  @Action(/MEETING_TYPE_.*/)
  async repertuar(@Ctx() ctx: Scenes.SceneContext) {
    const choosedBadgeId = getIdFromAction(ctx);

    ctx.scene.enter('meeting', { badgeId: choosedBadgeId });
  }

  @Action(/INVITATION_RESULT_*/)
  async decisionByInvitation(@Ctx() ctx: any) {
    const [, , decision, userTelegramId]: string[] = ctx.callbackQuery.data.split('_');
    const invitedUsers = users.filter(
      (user) => savedInvitationMessages.filter((m) => m.telegramId === user.telegramId).length > 0,
    );
    const [myInfo] = users.filter((u) => u.telegramId === +userTelegramId);

    if (decision === 'ACCEPT') {
      await Promise.all(
        invitedUsers.map((u) =>
          this.bot.telegram.sendMessage(u.telegramId, `${myInfo.fullName} will go with you 😊`),
        ),
      );

      return;
    }

    if (decision === 'REJECT') {
      await Promise.all(
        invitedUsers.map((u) =>
          this.bot.telegram.sendMessage(u.telegramId, `${myInfo.fullName} won't go with you 😔`),
        ),
      );
    }
  }
}
