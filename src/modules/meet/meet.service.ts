import { Injectable } from '@nestjs/common';
import { Scenes } from 'telegraf';

import { Badge, badges, Badges } from '../../mock/badges';
import { users, Users } from '../../mock/users';

@Injectable()
export class MeetService {
  getUserBadges = async (ctx: Scenes.SceneContext): Promise<Badges> => {
    const tgId = ctx.message.from.id;
    const { badges } = users.find((user) => user.telegramId === tgId);

    return badges;
  };

  generateMeetingButtons = (badges: Badges): { text: string; callback_data: string }[][] => {
    return badges.map((badge) => [
      {
        text: badge.name,
        callback_data: `MEETING_TYPE_${badge.id}`,
      },
    ]);
  };

  getBadgeById = async (id: number): Promise<Badge> => {
    return badges.find((badge) => badge.id === id);
  };

  findUsersWithBadge = async (badgeId: number, excludeId?: number): Promise<Users> => {
    const findedUsers = users.filter(
      (user) => user.badges.filter((badge) => badge.id === badgeId).length > 0,
    );

    if (typeof excludeId === 'number') {
      return findedUsers.filter((user) => user.telegramId !== excludeId);
    }

    return findedUsers;
  };
}
