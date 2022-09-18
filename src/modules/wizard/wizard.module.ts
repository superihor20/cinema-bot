import { Module } from '@nestjs/common';

import { MeetModule } from '../meet/meet.module';

import { AuthWizard } from './auth.wizard';
import { MeetingWizard } from './meeting.wizard';

@Module({
  imports: [MeetModule],
  providers: [AuthWizard, MeetingWizard],
})
export class WizardModule {}
