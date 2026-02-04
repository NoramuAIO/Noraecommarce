import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => FavoritesModule)],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
