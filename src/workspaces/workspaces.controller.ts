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
import { CreateWorkspaceDTO } from './dto/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dto/update-workspace.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AddResourceDTO } from './dto/add-resource.dto';
import { AddMemberDTO } from './dto/add-memeber.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { FranchiseWorkspaceDTO } from './dto/franchise-workspace.dto';
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
    @Body() createWorkspaceDTO: CreateWorkspaceDTO,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.create(createWorkspaceDTO, owner);
  }
  // Update workspace
  @Patch(':wksp_id')
  @Roles('MA', 'HM', 'PM')
  update(
    @Param('wksp_id') wksp_id: string,
    @Body() updateWorkspaceDTO: UpdateWorkspaceDTO,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.update(wksp_id, updateWorkspaceDTO, owner);
  }
  @Get(':wksp_id')
  getWorkspace(@Param('wksp_id') wksp_id: string) {
    return this.workspacesService.getOneWorkspace(wksp_id);
  }
  // Get all workspace
  @Get()
  getAllWorkspaces() {
    return this.workspacesService.getAllWorkspaces();
  }
  @Get('me')
  getUsersWorkspaces(@User() user: DecodeUser) {
    return this.workspacesService.getUsersWorkspaces(user);
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
    @Body() member: AddMemberDTO,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.addMember(wksp_id, member, owner);
  }

  // Remove member
  @Delete(':wksp_id/member')
  @Roles('MA', 'HM', 'PM')
  removeMember(
    @Param('wksp_id') wksp_id: string,
    @Body() member: AddMemberDTO,
    @User() owner: DecodeUser,
  ) {
    return this.workspacesService.removeMember(wksp_id, member, owner);
  }

  // Franchise workspace
  @Post(':wksp_id/franchise')
  @Roles('MA', 'HM', 'PM')
  franchiseWorkspace(
    @Param('wksp_id') wksp_id: string,
    @Body() data: FranchiseWorkspaceDTO,
    @User() user: DecodeUser,
  ) {
    console.log(user);
    return this.workspacesService.franchiseWorkspace(wksp_id, data, user);
  }

  // @Post('resources')
  // addResource(@Body() resource:AddResourceDTO) {
  //   return this.workspacesService.addResource(resource);
  // }
}
