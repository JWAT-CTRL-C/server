import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/entity/resource.entity';
import { Workspace } from 'src/entity/workspace.entity';
import { Blog } from 'src/entity/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, Workspace, Blog])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
