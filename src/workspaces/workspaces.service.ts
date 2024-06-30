import { User } from 'src/entity/user.entity';
import { UserWorkspace } from 'src/entity/user_workspace.entity';
import { Workspace } from 'src/entity/workspace.entity';
import { selectUserRelation } from 'src/lib/constant/workspace';
import { DecodeUser } from 'src/lib/type';
import { canPassThrough, generateUUID, removeFalsyFields } from 'src/lib/utils';
import { DataSource, IsNull, Not, Repository } from 'typeorm';

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AddMemberDTO } from './dto/add-member.dto';
import { CreateWorkspaceDTO } from './dto/create-workspace.dto';
import { FranchiseWorkspaceDTO } from './dto/franchise-workspace.dto';
import { UpdateWorkspaceDTO } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  private readonly LIMIT = 12;

  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
    private dataSource: DataSource,
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
      const workspace = this.workspaceRepository.create({
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

      await this.dataSource.manager.transaction(async (manager) => {
        await manager.save([owner, workspace, user_workspace]);
      });

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
      where: {
        wksp_id,
        ...canPassThrough<object>(wksp_owner, {
          onApprove: {},
          onDecline: { owner: { user_id: wksp_owner.user_id } },
        }),
      },
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
      .catch(() => {
        throw new ForbiddenException('Update workspace failed');
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
            users: removeFalsyFields(
              wksp.users.map(({ user }) =>
                user
                  ? {
                      user_id: user.user_id,
                      usrn: user.usrn,
                      avatar: user.avatar,
                      email: user.email,
                      fuln: user.fuln,
                      phone: user.phone,
                      role: user.role,
                    }
                  : null,
              ),
            ),
          };
        }
      });
      return new_wksp;
    } catch (err) {
      throw new ForbiddenException('Get workspace failed');
    }
  }
  async getOneWorkspace(wksp_id: string, user: DecodeUser) {
    const result = await this.workspaceRepository.findOne({
      select: {
        wksp_id: true,
        wksp_name: true,
        wksp_desc: true,
        owner: selectUserRelation,
        users: true,
        resources: {
          resrc_id: true,
          resrc_name: true,
          resrc_url: true,
          blog: {
            blog_id: true,
            blog_tle: true,
            blogRatings: true,
            blogImage: {
              blog_img_id: true,
              blog_img_url: true,
            },
            tags: {
              tag_name: true,
            },
          },
        },
        blogs: {
          blog_id: true,
          blog_tle: true,
          blogRatings: true,
          blogImage: {
            blog_img_id: true,
            blog_img_url: true,
          },
          crd_at: true,
          tags: {
            tag_name: true,
          },
          user: {
            user_id: true,
            usrn: true,
            fuln: true,
          },
        },
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
        blogs: {
          blogComments: true,
          blogImage: true,
          user: true,
        },
      },
    });
    if (!result) throw new NotFoundException('Workspace not found');
    if (
      !result.users.some((u) => u.user.user_id === user.user_id) &&
      !canPassThrough(user, { onApprove: true, onDecline: false })
    )
      throw new ForbiddenException('Permission denied');
    const workspace = {
      ...result,
      users: removeFalsyFields(
        result.users.map(({ user }) =>
          user
            ? {
                user_id: user.user_id,
                usrn: user.usrn,
                avatar: user.avatar,
                email: user.email,
                fuln: user.fuln,
                phone: user.phone,
                role: user.role,
              }
            : null,
        ),
      ),
    };
    return workspace;
    // .then((workspace) => workspace)
    // .catch((err) => {
    //   console.log(err);
    //   throw new NotFoundException('Workspace not found');
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
        where: {
          owner: Not(IsNull()),
        },
      });
      const new_wksp = workspace
        .map((wksp) => {
          if (wksp.users.length === 0) {
            return wksp;
          } else {
            if (
              wksp.users.some(
                (u) => u.user && u.user.user_id === user.user_id,
              ) ||
              user.role === 'MA' ||
              user.role === 'HM'
            ) {
              return {
                ...wksp,
                users: removeFalsyFields(
                  wksp.users.map(({ user }) =>
                    user
                      ? {
                          user_id: user.user_id,
                          usrn: user.usrn,
                          avatar: user.avatar,
                          email: user.email,
                          fuln: user.fuln,
                          phone: user.phone,
                          role: user.role,
                        }
                      : null,
                  ),
                ),
              };
            }
          }
        })
        .filter((wksp) => !!wksp);
      return new_wksp;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Get workspace failed');
    }
  }
  async getRecentWorkspaces(user: DecodeUser) {
    try {
      const workspaces = await this.workspaceRepository.find({
        select: {
          wksp_id: true,
          wksp_name: true,
          wksp_desc: true,
          users: true,
          owner: selectUserRelation,
          resources: true,
          crd_at: true,
        },
        relations: {
          users: { user: true },
          resources: {
            blog: true,
          },
          owner: true,
        },
        where: {
          users: {
            deleted_at: IsNull(),
            deleted_user_id: IsNull(),
          },
          owner: Not(IsNull()),
        },
      });
      const mapped_workspaces = workspaces
        .map((wksp) => {
          if (
            wksp.users.some((u) => u.user.user_id === user.user_id) ||
            user.role === 'MA'
          ) {
            return {
              ...wksp,
              users: wksp.users.map(({ user, upd_at }) => ({
                user_id: user.user_id,
                usrn: user.usrn,
                avatar: user.avatar,
                email: user.email,
                fuln: user.fuln,
                phone: user.phone,
                role: user.role,
                upd_at,
              })),
            };
          }
        })
        .filter((wksp) => Boolean(wksp))
        .sort((a, b) => {
          if (user.role === 'MA') {
            throw new Date(b.crd_at).getTime() - new Date(a.crd_at).getTime();
          } else {
            const meA = a.users.find((u) => u.user_id === user.user_id);
            const meB = b.users.find((u) => u.user_id === user.user_id);

            return meB.upd_at.getTime() - meA.upd_at.getTime();
          }
        });
      return mapped_workspaces;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Get workspace failed');
    }
  }
  async removeWorkspace(wksp_id: string, wksp_owner: DecodeUser) {
    return await Promise.all([
      this.userWorkspaceRepository.softDelete({
        workspace: {
          wksp_id,
        },
      }),
      this.userWorkspaceRepository.update(
        {
          workspace: {
            wksp_id,
          },
        },
        {
          deleted_user_id: wksp_owner.user_id,
        },
      ),
      this.workspaceRepository.softDelete(wksp_id),
      this.workspaceRepository.update(wksp_id, {
        deleted_user_id: wksp_owner.user_id,
      }),
    ])
      .then(() => {
        return { success: true, message: 'Workspace deleted successfully' };
      })
      .catch(() => {
        throw new ForbiddenException('Delete workspace failed');
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
      users: removeFalsyFields(
        result.users.map(({ user }) =>
          user
            ? {
                user_id: user.user_id,
                usrn: user.usrn,
                avatar: user.avatar,
                email: user.email,
                fuln: user.fuln,
                phone: user.phone,
                role: user.role,
              }
            : null,
        ),
      ),
    };
    return members;
  }
  async addMember(
    wksp_id: string,
    member: AddMemberDTO,
    wksp_owner: DecodeUser,
  ) {
    // check if user is already a member
    const user_wksp = await this.userWorkspaceRepository.findOne({
      where: {
        workspace: { wksp_id: wksp_id },
        user: { user_id: member.user_id },
        deleted_user_id: Not(IsNull()),
        deleted_at: Not(IsNull()),
      },
      withDeleted: true,
    });
    if (user_wksp) {
      if (!user_wksp.deleted_at) {
        throw new ForbiddenException('User already a member');
      } else {
        user_wksp.deleted_at = null;
        user_wksp.deleted_user_id = null;
        user_wksp.upd_user_id = wksp_owner.user_id;
        return await this.userWorkspaceRepository
          .save(user_wksp)
          .then(() => {
            return { success: true, message: 'Member added successfully' };
          })
          .catch(() => {
            throw new ForbiddenException('Add member failed');
          });
      }
    } else {
      // workspace
      const wksp = await this.workspaceRepository.findOne({
        where: {
          wksp_id: wksp_id,
          ...canPassThrough<object>(wksp_owner, {
            onApprove: {},
            onDecline: { owner: { user_id: wksp_owner.user_id } },
          }),
        },
        relations: { users: { user: true } },
      });
      if (!wksp) throw new ForbiddenException('Workspace not found');

      // user
      const user = await this.userRepository.findOne({
        where: { user_id: member.user_id },
        relations: { workspaces: true },
      });
      if (!user) throw new NotFoundException('User not found');
      // user_workspace
      const new_user_wksp = this.userWorkspaceRepository.create({
        workspace: wksp,
        user: user,
        crd_user_id: wksp_owner.user_id,
      });
      user.workspaces.push(user_wksp);
      wksp.users.push(user_wksp);
      await this.dataSource.manager
        .transaction(async (manager) => {
          await manager.save([user, wksp, new_user_wksp]);
        })
        .catch(() => {
          throw new ForbiddenException('Add member failed');
        });
      return { success: true, message: 'Member added successfully' };

      // await this.userWorkspaceRepository.save(new_user_wksp).catch(() => {
      //   throw new ForbiddenException('Add member failed');
      // });
      // return await Promise.all([
      //   this.workspaceRepository.save(wksp),
      //   this.userRepository.save(user),
      // ])
      //   .then(() => {
      //     return { success: true, message: 'Member added successfully' };
      //   })
      //   .catch(() => {
      //     throw new ForbiddenException('Add member failed');
      //   });
    }
  }
  async removeMember(
    wksp_id: string,
    member_id: number,
    wksp_owner: DecodeUser,
  ) {
    const wksp = await this.workspaceRepository.findOne({
      where: {
        wksp_id: wksp_id,
        ...canPassThrough<object>(wksp_owner, {
          onApprove: {},
          onDecline: { owner: { user_id: wksp_owner.user_id } },
        }),
      },
      relations: { owner: true },
    });
    if (wksp.owner.user_id === member_id)
      throw new NotFoundException('Owner cannot be removed');
    // user_workspace
    const user_wksp = await this.userWorkspaceRepository.findOneBy({
      workspace: { wksp_id: wksp_id },
      user: { user_id: member_id },
    });
    if (!user_wksp) throw new NotFoundException('Member not found');
    user_wksp.deleted_user_id = wksp_owner.user_id;
    await Promise.all([
      this.userWorkspaceRepository.save(user_wksp),
      this.userWorkspaceRepository.softDelete(user_wksp.user_workspace_id),
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
      where: {
        wksp_id: wksp_id,
        ...canPassThrough<object>(wksp_owner, {
          onApprove: {},
          onDecline: { owner: { user_id: wksp_owner.user_id } },
        }),
      },
      relations: { owner: true, users: true },
    });
    if (!wksp) throw new NotFoundException('Workspace not found');
    if (
      wksp.owner.user_id !== wksp_owner.user_id &&
      !['MA', 'HM'].includes(wksp_owner.role)
    )
      throw new ForbiddenException('Permission denied');

    // new owner
    const new_owner = await this.userRepository.findOne({
      where: { user_id: data.user_id, workspaces: { workspace: { wksp_id } } },
      relations: { workspacesOwner: true },
    });
    if (!new_owner) throw new NotFoundException('User is not in workspace');

    // old owner
    const old_owner = await this.userRepository.findOne({
      where: { user_id: wksp.owner.user_id, workspacesOwner: { wksp_id } },
      relations: { workspacesOwner: true },
    });
    if (!old_owner) throw new NotFoundException('Old owner not found');

    // franchise process
    new_owner.workspacesOwner.push(wksp);
    return await this.dataSource.manager
      .transaction(async (manager) => {
        await manager.save([new_owner]);
      })
      .then(() => {
        return {
          success: true,
          message: 'Franchise workspace updated successfully',
        };
      })
      .catch(() => {
        throw new ForbiddenException('Franchise workspace failed');
      });
  }

  async getWorkspacesForMasterAdmin(page: number, user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    const skip = (page - 1) * this.LIMIT;
    const [workspaces, totalWorkspaces] =
      await this.workspaceRepository.findAndCount({
        select: {
          wksp_id: true,
          wksp_name: true,
          wksp_desc: true,
          owner: selectUserRelation,
          resources: true,
          crd_at: true,
          users: true,
        },
        relations: {
          owner: true,
          resources: true,
          users: true,
        },
        skip,
        take: this.LIMIT,
      });
    const totalPages = Math.ceil(totalWorkspaces / this.LIMIT);
    return {
      data: workspaces,
      currentPage: page,
      totalPages,
    };
  }
}
