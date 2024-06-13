import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDTO } from './dto/create-workspace.dto';
import { UpdateWorkspaceDTO } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from 'src/entity/workspace.entity';
import { Repository } from 'typeorm';
import { generateUUID } from 'src/lib/utils';
import { User } from 'src/entity/user.entity';
import { Resource } from 'src/entity/resource.entity';
import {
  relationWithOwner,
  relationWithResources,
  relationWithResourcesNestBlog,
  relationWithUser,
  selectBasicWorkspace,
  selectOneWorkspace,
  workspaceBasicCondition,
} from 'src/lib/constant/workspace';
import { AddMemberDTO } from './dto/add-member.dto';
import { RemoveMemberDTO } from './dto/remove-member.dto';
import { FranchiseWorkspaceDTO } from './dto/franchise-workspace.dto';
import { DecodeUser } from 'src/lib/type';
import { relationWithResources } from 'src/lib/constant/resource';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createWorkspaceDTO: CreateWorkspaceDTO, wksp_owner: DecodeUser) {
    const wksp_id = generateUUID('workspace', wksp_owner.user_id);
    try {
      const owner = await this.userRepository.findOne({
        where: { user_id: wksp_owner.user_id },
        relations: { workspacesOwner: true, workspaces: true }, //todo change to constant
      });
      if (!owner) throw new NotFoundException('Owner not found');
      const workspace = this.workspaceRepository.create({
        wksp_id: wksp_id,
        wksp_name: createWorkspaceDTO.wksp_name,
        wksp_desc: createWorkspaceDTO.wksp_desc,
        users: [owner],
        owner: owner,
        crd_user_id: owner.user_id,
      });
      owner.workspacesOwner.push(workspace);
      owner.workspaces.push(workspace);
      await Promise.all([
        this.workspaceRepository.save(workspace),
        this.userRepository.save(owner),
      ]);

      return { success: true, message: 'Workspace created successfully' };
    } catch (err) {
      console.log(err);
      throw new ConflictException('Workspace already exists');
    }
  }
  async update(
    wksp_id: string,
    updateWorkspaceDTO: UpdateWorkspaceDTO,
    wksp_owner: DecodeUser,
  ) {
    try {
      const wksp = await this.workspaceRepository.findOne({
        where: { wksp_id },
        relations: { ...relationWithUser, ...relationWithOwner },
      });
      if (wksp.owner.user_id !== wksp_owner.user_id)
        throw new ForbiddenException('Only owner can update workspace');
      await this.workspaceRepository.update(wksp_id, {
        ...updateWorkspaceDTO,
        upd_user_id: wksp_owner.user_id,
      });

      return { success: true, message: 'Workspace updated successfully' };
    } catch (err) {
      return new ForbiddenException('Update workspace failed');
    }
  }
  async getAllWorkspaces() {
    try {
      const workspace = await this.workspaceRepository.find({
        select: selectBasicWorkspace,
        relations: relationWithUser,
      });
      return workspace;
    } catch (err) {
      return new ForbiddenException('Get workspace failed');
    }
  }
  async getOneWorkspace(wksp_id: string) {
    return await this.workspaceRepository
      .findOne({
        select: selectOneWorkspace,
        where: { wksp_id },
        relations: {
          ...relationWithUser,
          ...relationWithOwner,
          ...relationWithResources,
        },
      })
      .then((workspace) => workspace)
      .catch((err) => {
        console.log(err);
        return new NotFoundException('Workspace not found');
      });
  }
  async getUsersWorkspaces(user: DecodeUser) {
    try {
      const workspace = await this.workspaceRepository.find({
        select: selectBasicWorkspace,
        relations: { ...relationWithUser, ...relationWithResourcesNestBlog },
        where: {
          users: { user_id: user.user_id },
        },
      });
      return workspace;
    } catch (err) {
      return new ForbiddenException('Get workspace failed');
    }
  }
  async removeWorkspace(wksp_id: string, wksp_owner: DecodeUser) {
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id },
      relations: { ...relationWithUser, ...relationWithOwner },
    });
    if (wksp.owner.user_id !== wksp_owner.user_id)
      throw new ForbiddenException('Only owner can delete workspace');
    await Promise.all([
      this.workspaceRepository.softDelete(wksp_id),
      this.workspaceRepository.update(wksp_id, {
        deleted_user_id: wksp_owner.user_id,
      }),
    ]);
    return { success: true, message: 'Workspace deleted successfully' };
  }
  async addMember(
    wksp_id: string,
    member: AddMemberDTO,
    wksp_owner: DecodeUser,
  ) {
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id },
      relations: { ...relationWithUser, ...relationWithOwner },
    });
    if (wksp.owner.user_id !== wksp_owner.user_id)
      throw new ForbiddenException('Only owner can add member');
    const user = await this.userRepository.findOne({
      where: { user_id: member.user_id },
      relations: { workspaces: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (wksp.users.find((u) => u.user_id === member.user_id))
      throw new ConflictException('User already in workspace');
    wksp.users.push(user);
    user.workspaces.push(wksp);
    await Promise.all([
      this.userRepository.save(user),
      this.workspaceRepository.save(wksp),
    ]);

    return { success: true, message: 'Member added successfully' };
  }
  async removeMember(
    wksp_id: string,
    member: RemoveMemberDTO,
    wksp_owner: DecodeUser,
  ) {
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
      const user = await this.userRepository.findOne({
        where: { user_id: member.user_id },
        relations: { workspaces: true },
      });
      if (!user) throw new NotFoundException('User not found');

      wksp.users = wksp.users.filter((user) => user.user_id !== member.user_id);
      user.workspaces = user.workspaces.filter(
        (workspace) => workspace.wksp_id !== wksp.wksp_id,
      );
      await Promise.all([
        this.workspaceRepository.save(wksp),
        this.userRepository.save(user),
      ]);
      return { success: true, message: 'Member removed successfully' };
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Remove member failed');
    }
  }
  async franchiseWorkspace(
    wksp_id: string,
    data: FranchiseWorkspaceDTO,
    wksp_owner: DecodeUser,
  ) {
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id },
      relations: { ...relationWithUser, ...relationWithOwner },
    });
    if (!wksp) throw new NotFoundException('Workspace not found');
    if (wksp.owner.user_id !== wksp_owner.user_id)
      throw new ForbiddenException('Permission denied');
    const new_owner = await this.userRepository.findOne({
      where: { user_id: data.user_id },
      relations: { workspacesOwner: true },
    });
    if (!new_owner) throw new NotFoundException('New owner not found');
    if (!wksp.users.find((u) => u.user_id === new_owner.user_id))
      throw new ForbiddenException('New owner is not in workspace');
    const old_owner = await this.userRepository.findOne({
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
      this.userRepository.save(new_owner),
      this.userRepository.save(old_owner),
      this.workspaceRepository.save(wksp),
    ]);
    return {
      success: true,
      message: 'Franchise workspace updated successfully',
    };
  }
  // async addResource(resource: AddResourceDTO) {
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
