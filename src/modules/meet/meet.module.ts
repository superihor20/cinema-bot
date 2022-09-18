import { Module } from '@nestjs/common';

import { MeetCommand } from './meet.command';
import { MeetService } from './meet.service';

@Module({
  providers: [MeetCommand, MeetService],
  exports: [MeetService],
})
export class MeetModule {}
