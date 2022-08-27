import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PortalCommands } from './portal.commands';
import { PortalService } from './portal.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: 'http://online.portalcinema.com.ua/site',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }),
    }),
  ],
  providers: [PortalCommands, PortalService],
})
export class PortalModule {}
