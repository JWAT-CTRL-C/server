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
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AddResourceDto } from './dto/add-resource.dto';
import { AddMemberDto } from './dto/add-memeber.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { FranchiseWorkspaceDto } from './dto/franchise-workspace.dto';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';
@UseGuards(RolesGuard)
@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}
  // Create workspace
  @Post()
  @Roles('MA', 'HM', 'PM')
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.create(createWorkspaceDto,owner);
  }
  // Update workspace
  @Patch(':wksp_id')
  @Roles('MA', 'HM', 'PM')
  update(
    @Param('wksp_id') wksp_id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.update(wksp_id, updateWorkspaceDto, owner);
  }
  @Get(':wksp_id')
  getWorkspace(@Param('wksp_id') wksp_id: string) {
    return this.workspacesService.getOneWorkspace(wksp_id);
  }
  // Get all workspace
  @Get()
  getAllWorkspace() {
    return this.workspacesService.getAllWorkspace();
  }
  // Soft delete workspace
  @Delete(':wksp_id')
  @Roles('MA', 'HM', 'PM')
  deleteWorkspace(
    @Param('wksp_id') wksp_id: string,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.removeWorkspace(wksp_id, owner);
  }

  // Add member
  @Post(':wksp_id/member')
  @Roles('MA', 'HM', 'PM')
  addMember(
    @Param('wksp_id') wksp_id: string,
    @Body() member: AddMemberDto,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.addMember(wksp_id, member, owner);
  }

  // Remove member
  @Delete(':wksp_id/member')
  @Roles('MA', 'HM', 'PM')
  removeMember(
    @Param('wksp_id') wksp_id: string,
    @Body() member: AddMemberDto,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.removeMember(wksp_id, member, owner);
  }

  // Franchise workspace
  @Post(':wksp_id/franchise')
  @Roles('MA', 'HM', 'PM')
  franchiseWorkspace(
    @Param('wksp_id') wksp_id: string,
    @Body() data: FranchiseWorkspaceDto,
    @User() user: DecodeUser,
  ) {
    console.log(user);
    return this.workspacesService.franchiseWorkspace(wksp_id, data, user);
  }

  // @Post('resources')
  // addResource(@Body() resource:AddResourceDto) {
  //   return this.workspacesService.addResource(resource);
  // }
}
