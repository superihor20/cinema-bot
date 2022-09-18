import { Module } from '@nestjs/common';

import { StartCommand } from './start.commands';
import { StartService } from './start.service';

@Module({
  providers: [StartCommand, StartService],
})
export class StartModule {}
