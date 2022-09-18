import { Injectable } from '@nestjs/common';
import { Update, Ctx, Start } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

import { StartService } from './start.service';

@Injectable()
@Update()
export class StartCommand {
  constructor(private startService: StartService) {}

  @Start()
  async start(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply(this.startService.greetingsMessage());
    await ctx.scene.enter('auth');
  }
}
