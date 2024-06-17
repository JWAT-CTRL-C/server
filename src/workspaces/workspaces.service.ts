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
import {
  relationWithResourcesNestBlog,
  selectUserRelation,
} from 'src/lib/constant/workspace';
import { AddMemberDTO } from './dto/add-member.dto';
import { FranchiseWorkspaceDTO } from './dto/franchise-workspace.dto';
import { DecodeUser } from 'src/lib/type';
import {
  relationWithResources,
  selectResources,
} from 'src/lib/constant/resource';
import { UserWorkspace } from 'src/entity/user_workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
  ) {}

  async create(createWorkspaceDTO: CreateWorkspaceDTO, wksp_owner: DecodeUser) {
    const wksp_id = generateUUID('workspace', wksp_owner.user_id);
    try {
      const owner = await this.userRepository.findOne({
        where: { user_id: wksp_owner.user_id },
        relations: { workspacesOwner: true, workspaces: true }, //todo change to constant
      });
      if (!owner) throw new NotFoundException('Owner not found');
      const user_workspace = await this.userWorkspaceRepository.create({
        user: owner,
      });
      const workspace = await this.workspaceRepository.create({
        wksp_id: wksp_id,
        wksp_name: createWorkspaceDTO.wksp_name,
        wksp_desc: createWorkspaceDTO.wksp_desc,
        owner: owner,
        users: [user_workspace],
        crd_user_id: owner.user_id,
      });

      user_workspace.workspace = workspace;
      owner.workspacesOwner.push(workspace);
      owner.workspaces.push(user_workspace);

      await Promise.all([
        this.userWorkspaceRepository.save(user_workspace),
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
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id, owner: { user_id: wksp_owner.user_id } },
      relations: { owner: true },
    });
    if (!wksp) throw new ForbiddenException('Update workspace failed');
    return await this.workspaceRepository
      .update(wksp_id, {
        ...updateWorkspaceDTO,
        upd_user_id: wksp_owner.user_id,
      })
      .then(() => {
        return { success: true, message: 'Workspace updated successfully' };
      })
      .catch((err) => {
        return new ForbiddenException('Update workspace failed');
      });
  }

  async getAllWorkspaces() {
    try {
      const workspace = await this.workspaceRepository.find({
        select: {
          wksp_id: true,
          wksp_name: true,
          wksp_desc: true,
          users: true,
          owner: selectUserRelation,
        },
        relations: {
          owner: true,
          users: {
            user: true,
          },
        },
      });
      const new_wksp = workspace.map((wksp) => {
        if (wksp.users.length === 0) {
          return wksp;
        } else {
          return {
            ...wksp,
            users: wksp.users.map(({ user }) => ({
              user_id: user.user_id,
              usrn: user.usrn,
              avatar: user.avatar,
              email: user.email,
              fuln: user.fuln,
              phone: user.phone,
              role: user.role,
            })),
          };
        }
      });
      return new_wksp;
    } catch (err) {
      return new ForbiddenException('Get workspace failed');
    }
  }
  async getOneWorkspace(wksp_id: string) {
    const result = await this.workspaceRepository.findOne({
      select: {
        wksp_id: true,
        wksp_name: true,
        wksp_desc: true,
        owner: selectUserRelation,
        users: true,
        resources: true,
      },
      where: { wksp_id },
      relations: {
        owner: true,
        users: {
          user: true,
        },
        resources: {
          blog: true,
        },
      },
    });
    if (!result) throw new NotFoundException('Workspace not found');

    const workspace = {
      ...result,
      users: result.users.map(({ user }) => ({
        user_id: user.user_id,
        usrn: user.usrn,
        avatar: user.avatar,
        email: user.email,
        fuln: user.fuln,
        phone: user.phone,
        role: user.role,
      })),
    };
    return workspace;
    // .then((workspace) => workspace)
    // .catch((err) => {
    //   console.log(err);
    //   return new NotFoundException('Workspace not found');
    // });
  }
  async getUsersWorkspaces(user: DecodeUser) {
    try {
      const workspace = await this.workspaceRepository.find({
        select: {
          wksp_id: true,
          wksp_name: true,
          wksp_desc: true,
          users: true,
          owner: selectUserRelation,
          resources: true,
        },
        relations: {
          users: { user: true },
          resources: {
            blog: true,
          },
          owner: true,
        },
      });
      const new_wksp = workspace.map((wksp) => {
        if (wksp.users.length === 0) {
          return wksp;
        } else {
          return {
            ...wksp,
            users: wksp.users.map(({ user }) => ({
              user_id: user.user_id,
              usrn: user.usrn,
              avatar: user.avatar,
              email: user.email,
              fuln: user.fuln,
              phone: user.phone,
              role: user.role,
            })),
          };
        }
      });
      return new_wksp;
    } catch (err) {
      console.log(err);
      return new ForbiddenException('Get workspace failed');
    }
  }
  async removeWorkspace(wksp_id: string, wksp_owner: DecodeUser) {
    return await Promise.all([
      this.workspaceRepository.softDelete(wksp_id),
      this.workspaceRepository.update(wksp_id, {
        deleted_user_id: wksp_owner.user_id,
      }),
    ])
      .then(() => {
        return { success: true, message: 'Workspace deleted successfully' };
      })
      .catch((err) => {
        return new ForbiddenException('Delete workspace failed');
      });
  }
  async getMember(wksp_id: string) {
    const result = await this.workspaceRepository.findOne({
      select: {
        wksp_id: true,
        wksp_name: true,
        wksp_desc: true,
        owner: selectUserRelation,
        users: true,
      },
      where: { wksp_id },
      relations: {
        users: {
          user: true,
        },
        owner: true,
      },
    });
    const members = {
      ...result,
      users: result.users.map(({ user }) => ({
        user_id: user.user_id,
        usrn: user.usrn,
        avatar: user.avatar,
        email: user.email,
        fuln: user.fuln,
        phone: user.phone,
        role: user.role,
      })),
    };
    return members;
  }
  async addMember(
    wksp_id: string,
    member: AddMemberDTO,
    wksp_owner: DecodeUser,
  ) {
    // workspace
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id, owner: { user_id: wksp_owner.user_id } },
      relations: { users: { user: true } },
    });
    if (!wksp) throw new ForbiddenException('Workspace not found');

    // user
    const user = await this.userRepository.findOne({
      where: { user_id: member.user_id },
      relations: { workspaces: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // check if user is already a member
    const user_wksp = await this.userWorkspaceRepository.findOneBy({
      workspace: { wksp_id: wksp_id },
      user: { user_id: member.user_id },
    });
    if (user_wksp) throw new ForbiddenException('User already a member');
    // user_workspace
    const new_user_wksp = await this.userWorkspaceRepository.create({
      workspace: wksp,
      user: user,
      crd_user_id: wksp_owner.user_id,
    });
    user.workspaces.push(user_wksp);
    wksp.users.push(user_wksp);
    return await Promise.all([
      this.userWorkspaceRepository.save(new_user_wksp),
      this.workspaceRepository.save(wksp),
      this.userRepository.save(user),
    ])
      .then(() => {
        return { success: true, message: 'Member added successfully' };
      })
      .catch((err) => {
        return new ForbiddenException('Add member failed');
      });
  }
  async removeMember(
    wksp_id: string,
    member_id: number,
    wksp_owner: DecodeUser,
  ) {
    // user_workspace
    const user_wksp = await this.userWorkspaceRepository.findOneBy({
      workspace: { wksp_id: wksp_id },
      user: { user_id: member_id },
    });
    if (!user_wksp) throw new NotFoundException('Member not found');
    await Promise.all([
      this.userWorkspaceRepository.softDelete(user_wksp.user_workspace_id),
      this.userWorkspaceRepository.update(user_wksp.user_workspace_id, {
        upd_user_id: wksp_owner.user_id,
      }),
    ]);
    return { success: true, message: 'Member removed successfully' };
  }
  async franchiseWorkspace(
    wksp_id: string,
    data: FranchiseWorkspaceDTO,
    wksp_owner: DecodeUser,
  ) {
    // workspace
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id, owner: { user_id: wksp_owner.user_id } },
      relations: { owner: true, users: true },
    });
    if (!wksp) throw new NotFoundException('Workspace not found');
    if (wksp.owner.user_id !== wksp_owner.user_id)
      throw new ForbiddenException('Permission denied');

    // new owner
    const new_owner = await this.userRepository.findOne({
      where: { user_id: data.user_id, workspaces: { workspace: { wksp_id } } },
      relations: { workspacesOwner: true },
    });
    if (!new_owner) throw new NotFoundException('User is not in workspace');

    // old owner
    const old_owner = await this.userRepository.findOne({
      where: { user_id: wksp_owner.user_id, workspacesOwner: { wksp_id } },
      relations: { workspacesOwner: true },
    });
    if (!old_owner) throw new NotFoundException('Old owner not found');

    // franchise process
    old_owner.workspacesOwner = old_owner.workspacesOwner.filter(
      (workspace) => workspace.wksp_id !== wksp_id,
    );
    wksp.owner = new_owner;
    new_owner.workspacesOwner.push(wksp);
    return await Promise.all([
      this.workspaceRepository.save(wksp),
      this.userRepository.save(new_owner),
      this.userRepository.save(old_owner),
    ])
      .then(() => {
        return {
          success: true,
          message: 'Franchise workspace updated successfully',
        };
      })
      .catch((err) => {
        return new ForbiddenException('Franchise workspace failed');
      });
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
