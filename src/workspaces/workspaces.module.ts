import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/entity/resource.entity';
import { Blog } from 'src/entity/blog.entity';
import { User } from 'src/entity/user.entity';
import { Workspace } from 'src/entity/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Resource, Blog, Workspace])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
