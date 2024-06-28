import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDTO } from './dto/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dto/update-workspace.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AddMemberDTO } from './dto/add-member.dto';
import { RolesGuard } from 'src/guard/roles.guard';
import { FranchiseWorkspaceDTO } from './dto/franchise-workspace.dto';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';
import { RemoveMemberDTO } from './dto/remove-member.dto';
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiTags('workspaces')
@ApiHeader({
  name: 'x-user-id',
  required: true,
})
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
  // get users' workspace
  @Get('me')
  getUsersWorkspaces(@User() user: DecodeUser) {
    return this.workspacesService.getUsersWorkspaces(user);
  }
  // Get all workspace
  @Get()
  getAllWorkspaces() {
    return this.workspacesService.getAllWorkspaces();
  }

  // Get recent workspaces
  @Get('recent')
  getRecentWorkspaces(@User() user: DecodeUser) {
    return this.workspacesService.getRecentWorkspaces(user);
  }

  // get specific workspace
  @Get(':wksp_id')
  getWorkspace(@Param('wksp_id') wksp_id: string) {
    return this.workspacesService.getOneWorkspace(wksp_id);
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

  // Get member
  @Get(':wksp_id/member')
  @Roles('MA', 'HM', 'PM')
  getMember(@Param('wksp_id') wksp_id: string) {
    return this.workspacesService.getMember(wksp_id);
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
  @Delete(':wksp_id/member/:mem_id')
  @Roles('MA', 'HM', 'PM')
  removeMember(
    @Param('wksp_id') wksp_id: string,
    @Param('mem_id', ParseIntPipe) member: number,
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
    return this.workspacesService.franchiseWorkspace(wksp_id, data, user);
  }
  @Roles('MA')
  @Get('for/master-admin')
  getWorkspacesForMasterAdmin(
    @User() user: DecodeUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.workspacesService.getWorkspacesForMasterAdmin(page, user);
  }
}
