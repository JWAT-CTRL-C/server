import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/entity/resource.entity';
import { Workspace } from 'src/entity/workspace.entity';
import { DecodeUser } from 'src/lib/type';
import { canPassThrough, generateUUID } from 'src/lib/utils';
import { Repository } from 'typeorm';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { UpdateResourceDTO } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  // get all resources belong to workspace
  async getWorkspaceResources(wksp_id: string) {
    return await this.resourceRepository.find({
      select: {
        resrc_id: true,
        resrc_name: true,
        resrc_url: true,
        blog: {
          blog_id: true,
        },
      },
      where: { workspace: { wksp_id } },
      relations: {
        blog: true,
      },
    });
  }
  // get one resource belong to workspace
  async getWorkspaceResource(wksp_id: string, resrc_id: string) {
    const result = await this.resourceRepository.findOne({
      where: { workspace: { wksp_id }, resrc_id },
      relations: {
        workspace: {
          owner: true,
        },
        blog: {
          tags: true,
          user: true,
          blogImage: true,
        },
      },
      select: {
        resrc_id: true,
        resrc_name: true,
        resrc_url: true,
        blog: {
          blog_id: true,
          blog_tle: true,
          crd_at: true,
          blog_cont: true,
          blogImage: {
            blog_img_id: true,
            blog_img_url: true,
          },
          user: {
            user_id: true,
            usrn: true,
            fuln: true,
            avatar: true,
          },
          tags: {
            tag_id: true,
            tag_name: true,
          },
        },
        workspace: {
          wksp_id: true,
          owner: {
            user_id: true,
          },
        },
      },
    });
    if (!result) throw new NotFoundException('Resource not found');
    const resource = {
      ...result,
      blog: result.blog ? result.blog : {},
    };
    return resource;
  }
  // add new resource into workspace
  async addResource(
    wksp_id: string,
    resource: CreateResourceDTO,
    user: DecodeUser,
  ) {
    const wksp = await this.workspaceRepository.findOne({
      where: {
        wksp_id: wksp_id,
        ...canPassThrough<object>(user, {
          onApprove: {},
          onDecline: { owner: { user_id: user.user_id } },
        }),
      },
      relations: { resources: true },
    });
    if (!wksp) {
      throw new NotFoundException('Workspace not found');
    }
    const resrc = this.resourceRepository.create({
      resrc_id: generateUUID('resource', wksp_id),
      resrc_name: resource.resrc_name,
      resrc_url: resource.resrc_url,
      crd_user_id: user.user_id,
      workspace: wksp,
    });
    wksp.resources.push(resrc);
    return await Promise.all([
      this.resourceRepository.save(resrc),
      this.workspaceRepository.save(wksp),
    ])
      .then(() => {
        return { success: true, message: 'Resource added successfully' };
      })
      .catch(() => {
        return new ForbiddenException('Resource added to workspace failed');
      });
  }

  // update resource
  async updateResource(
    resource: UpdateResourceDTO,
    wksp_id: string,
    resrc_id: string,
    user: DecodeUser,
  ) {
    const resrc = await this.resourceRepository.findOne({
      where: { resrc_id, workspace: { wksp_id } },
      relations: { workspace: true },
    });
    if (!resrc) {
      throw new NotFoundException('Resource not found');
    }
    await this.resourceRepository.upsert(
      { ...resrc, ...resource, upd_user_id: user.user_id },
      ['resrc_id'],
    );
    return { success: true, message: 'Resource updated successfully' };
  }
  // remove resource
  async deleteResource(wksp_id: string, resrc_id: string, user: DecodeUser) {
    const resrc = await this.resourceRepository.findOne({
      where: { resrc_id, workspace: { wksp_id } },
      relations: { workspace: true },
    });
    if (!resrc) {
      throw new NotFoundException('Resource not found');
    }
    resrc.deleted_user_id = user.user_id;
    return await Promise.all([
      this.resourceRepository.save(resrc),
      this.resourceRepository.softDelete(resrc_id),
    ])
      .then(() => {
        return { success: true, message: 'Resource deleted successfully' };
      })
      .catch(() => {
        return new ForbiddenException('Resource deleted failed');
      });
  }
}
