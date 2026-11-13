import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogOptionsController } from './catalog-options.controller';
import { CatalogService } from './catalog.service';

@Module({
  controllers: [CatalogController, CatalogOptionsController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
