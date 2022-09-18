import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';

import { MeetModule } from '../meet/meet.module';
import { StartModule } from '../start/start.module';
import { WizardModule } from '../wizard/wizard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        launchOptions: {
          dropPendingUpdates: true,
          allowedUpdates: ['callback_query', 'chat_member', 'message', 'my_chat_member'],
        },
        middlewares: [session()],
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    StartModule,
    WizardModule,
    MeetModule,
  ],
})
export class AppModule {}
