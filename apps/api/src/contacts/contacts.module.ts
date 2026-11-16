import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { ContactsController, AdminContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [ContactsController, AdminContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}

