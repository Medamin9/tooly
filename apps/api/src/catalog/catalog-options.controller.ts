import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog-options')
export class CatalogOptionsController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiOperation({ summary: 'Get active delivery options and plan durations' })
  @ApiQuery({ name: 'locale', required: false, enum: ['ar', 'fr', 'en'] })
  async getOptions(@Query('locale') locale: 'ar' | 'fr' | 'en' = 'ar') {
    const safeLocale =
      locale === 'fr' || locale === 'en' || locale === 'ar' ? locale : 'ar';
    return this.catalogService.getPublicCatalogOptions(safeLocale);
  }
}

