import { Injectable } from '@nestjs/common';
import { Update, Ctx, Start, Command, Action } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

import { PortalService } from './portal.service';

@Injectable()
@Update()
export class PortalCommands {
  constructor(private portalService: PortalService) {}

  @Start()
  async start(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply(this.portalService.greetingsMessage());
  }

  @Command('films')
  async films(@Ctx() ctx: Scenes.SceneContext) {
    const films = await this.portalService.films();

    await ctx.reply('Оберіть кінострічку: ', {
      reply_markup: {
        inline_keyboard: this.portalService.generateFilmButtons(films),
      },
    });
  }

  @Action(/FILM_.*/)
  async repertuar(@Ctx() ctx: Scenes.SceneContext) {
    const filmId = this.portalService.getFilmId(ctx);
    const repertuar = await this.portalService.repertuar(filmId);

    await ctx.reply(this.portalService.generateRepertuarMessage(repertuar));
  }
}
