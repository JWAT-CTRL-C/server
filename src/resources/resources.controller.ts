import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
@UseGuards(RolesGuard)
@Controller('resources')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-user-id',
  required: true,
})
@ApiTags('Resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // get all resources belong to workspace
  @Get(':wksp_id')
  getWorkspaceResources(@Param('wksp_id') wksp_id: string) {
    return this.resourcesService.getWorkspaceResources(wksp_id);
  }

  // get one resource belong to workspace
  @Get(':wksp_id/:resrc_id')
  getWorkspaceResource(
    @Param('wksp_id') wksp_id: string,
    @Param('resrc_id') resrc_id: string,
  ) {
    return this.resourcesService.getWorkspaceResource(wksp_id, resrc_id);
  }
  // add new resource into workspace
  @Roles('MA', 'HM', 'PM')
  @Post(':wksp_id/add')
  addResource(
    @Param('wksp_id') wksp_id: string,
    @Body() resource: CreateResourceDTO,
    @User() user: DecodeUser,
  ) {
    return this.resourcesService.addResource(wksp_id, resource, user);
  }

  // update resource
  @Roles('MA', 'HM', 'PM')
  @Patch(':wksp_id/:resrc_id')
  updateResource(
    @Param('wksp_id') wksp_id: string,
    @Param('resrc_id') resrc_id: string,
    @Body() resource: CreateResourceDTO,
    @User() user: DecodeUser,
  ) {
    return this.resourcesService.updateResource(
      resource,
      wksp_id,
      resrc_id,
      user,
    );
  }
  @Roles('MA', 'HM', 'PM')

  // delete resource
  @Delete(':wksp_id/:resrc_id')
  deleteResource(
    @Param('wksp_id') wksp_id: string,
    @Param('resrc_id') resrc_id: string,
    @User() user: DecodeUser,
  ) {
    return this.resourcesService.deleteResource(wksp_id, resrc_id, user);
  }
}
