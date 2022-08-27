import { Module } from '@nestjs/common';

import { PortalController } from './portal.controller';

@Module({
  providers: [PortalController],
})
export class PortalModule {}
