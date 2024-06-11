import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from 'src/entity/workspace.entity';
import { Repository } from 'typeorm';
import { generateUUID } from 'src/lib/utils';
import { User } from 'src/entity/user.entity';
import { Resource } from 'src/entity/resource.entity';
import {
  defaultCondition,
  relationWithOwner,
  relationWithUser,
  relationWithWorkspace,
  selectBasicWorkspace,
  selectOneWorkspace,
  selectUserRelation,
  workspaceBasicCondition,
} from 'src/lib/constant/workspace';
import { AddResourceDto } from './dto/add-resource.dto';
import { AddMemberDto } from './dto/add-memeber.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { FranchiseWorkspaceDto } from './dto/franchise-workspace.dto';
import { DecodeUser } from 'src/lib/type';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(Resource) private resouceRepository: Repository<Resource>,
    @InjectRepository(User) private userRespsitory: Repository<User>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, wksp_owner: DecodeUser) {
    const wksp_id = generateUUID('workspace', wksp_owner.user_id);
    try {
      const owner = await this.userRespsitory.findOne({
        where: { user_id: wksp_owner.user_id },
        relations: { workspacesOwner: true }, //todo change to constant
      });
      if (!owner) throw new NotFoundException('Owner not found');
      const workspace = this.workspaceRepository.create({
        wksp_id: wksp_id,
        wksp_name: createWorkspaceDto.wksp_name,
        wksp_desc: createWorkspaceDto.wksp_desc,
        users: [owner],
        owner: owner,
      });
      owner.workspacesOwner.push(workspace);
      await Promise.all([
        this.workspaceRepository.save(workspace),
        this.userRespsitory.save(owner),
      ]);

      return { success: true, message: 'Workspace created successfully' };
    } catch (err) {
      console.log(err);
      throw new ConflictException('Workspace already exists');
    }
  }
  async update(
    wksp_id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    wksp_owner: DecodeUser,
  ) {
    try {
      const wksp = await this.workspaceRepository.findOne({
        where: { wksp_id, ...defaultCondition },
        relations: { ...relationWithUser, ...relationWithOwner },
      })
      if(wksp.owner.user_id !== wksp_owner.user_id) throw new ForbiddenException('Only owner can update workspace')
      await this.workspaceRepository.update(wksp_id, {
        ...updateWorkspaceDto,
      });

      return { success: true, message: 'Workspace updated successfully' };
    } catch (err) {
      return new ForbiddenException('Update worksapce failed');
    }
  }
  async getAllWorkspace() {
    try {
      const workspace = await this.workspaceRepository.find({
        select: selectBasicWorkspace,
        relations: relationWithUser,
        where: workspaceBasicCondition,
      });
      return workspace;
    } catch (err) {
      return new ForbiddenException('Get worksapce failed');
    }
  }
  async getOneWorkspace(wksp_id: string) {
    return await this.workspaceRepository
      .findOne({
        select: selectOneWorkspace,
        where: { wksp_id, ...defaultCondition },
        relations: { ...relationWithUser, ...relationWithOwner },
      })
      .then((workspace) => {
        return workspace;
      })
      .catch((err) => {
        return new NotFoundException('Workspace not found');
      });
  }
  async removeWorkspace(wksp_id: string, wksp_owner: DecodeUser) {
    try {
 const wksp = await this.workspaceRepository.findOne({
   where: { wksp_id, ...defaultCondition },
   relations: { ...relationWithUser, ...relationWithOwner },
 });
 if (wksp.owner.user_id !== wksp_owner.user_id)
   throw new ForbiddenException('Only owner can delete workspace');
      await this.workspaceRepository.update(wksp_id, {
        deleted_at: new Date(),
      });
    } catch (err) {
      throw new ForbiddenException('Remove workspace failed');
    }
  }
  async addMember(wksp_id: string, member: AddMemberDto, wksp_owner: DecodeUser) {
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id },
      relations: { ...relationWithUser, ...relationWithOwner },
    });
     if (wksp.owner.user_id !== wksp_owner.user_id)
       throw new ForbiddenException('Only owner can add member');
    const user = await this.userRespsitory.findOne({
      where: { user_id: member.user_id },
    });
    if (!user) throw new NotFoundException('User not found');
    if (wksp.users.find((u) => u.user_id === member.user_id))
      throw new ConflictException('User already in workspace');
    wksp.users.push(user);
    console.log(wksp);
    await this.userRespsitory.save(user);
    await this.workspaceRepository.save(wksp);

    return { success: true, message: 'Member added successfully' };
  }
  async removeMember(wksp_id: string, member: RemoveMemberDto, wksp_owner: DecodeUser) {
    try {
      const wksp = await this.workspaceRepository.findOne({
        where: { wksp_id: wksp_id, owner: { user_id: member.user_id } },
        relations: { ...relationWithUser, ...relationWithOwner },
      });
      if (!wksp) throw new NotFoundException('Workspace not found');
      if (wksp.owner.user_id === member.user_id)
        throw new ForbiddenException('Cannot remove owner');
 if (wksp.owner.user_id !== wksp_owner.user_id)
   throw new ForbiddenException('Only owner can remove member');
      const user = await this.userRespsitory.findOne({
        where: { user_id: member.user_id },
      });
      if (!user) throw new NotFoundException('User not found');

      wksp.users = wksp.users.filter((user) => user.user_id !== member.user_id);
      await Promise.all([
        this.workspaceRepository.save(wksp),
        this.userRespsitory.save(user),
      ]);
      return { success: true, message: 'Member removed successfully' };
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Remove member failed');
    }
  }
  async franchiseWorkspace(wksp_id: string, data: FranchiseWorkspaceDto, wksp_owner: DecodeUser) {
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id },
      relations: { ...relationWithUser, ...relationWithOwner },
    });
    if (!wksp) throw new NotFoundException('Workspace not found');
    if (wksp.owner.user_id !== wksp_owner.user_id)
      throw new ForbiddenException('Permission denied');
    const new_owner = await this.userRespsitory.findOne({
      where: { user_id: data.user_id },
      relations: { workspacesOwner: true },
    });
    if (!new_owner) throw new NotFoundException('New owner not found');
    if (!wksp.users.find((u) => u.user_id === new_owner.user_id))
      throw new ForbiddenException('New owner is not in workspace');
    const old_owner = await this.userRespsitory.findOne({
      where: { user_id: wksp_owner.user_id },
      relations: { workspacesOwner: true },
    });
    if (!old_owner) throw new NotFoundException('Old owner not found');
    old_owner.workspacesOwner = old_owner.workspacesOwner.filter(
      (workspace) => workspace.wksp_id !== wksp_id,
    );
    wksp.owner = new_owner;
    new_owner.workspacesOwner.push(wksp);
    await Promise.all([
      this.userRespsitory.save(new_owner),
      this.userRespsitory.save(old_owner),
      this.workspaceRepository.save(wksp),
    ]);
    return {
      success: true,
      message: 'Franchise workspace updated successfully',
    };
  }
  // async addResource(resource: AddResourceDto) {
  //   try {
  //     const rsrc = this.resouceRepository.create({
  //       resrc_id: generateUUID('resource', resource.wksp_id),
  //       resrc_name: resource.resrc_name,
  //       resrc_url: resource.resrc_url,
  //     });
  //     await this.resouceRepository.save(rsrc);
  //     return await this.workspaceRepository
  //       .update(resource.wksp_id, {
  //         resources: [rsrc],
  //       })
  //       .then(() => {
  //         return { success: true, message: 'Resource added successfully' };
  //       });
  //   } catch (err) {
  //     throw new ForbiddenException('Add resource failed');
  //   }
  // }
}
