import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { Repository } from 'typeorm';
import { Resource } from 'src/entity/resource.entity';
import { generateUUID } from 'src/lib/utils';
import { Workspace } from 'src/entity/workspace.entity';
import {
  selectResources,
  selectWorkspaceResources,
} from 'src/lib/constant/resource';
import { UpdateResourceDTO } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodeUser } from 'src/lib/type';
import { relationWithResources } from 'src/lib/constant/workspace';

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
      select: selectResources,
      where: { workspace: { wksp_id } },
    });
  }
  // get one resource belong to workspace
  async getWorkspaceResource(wksp_id: string, resrc_id: string) {
    return await this.resourceRepository.findOne({
      select: selectResources,
      where: { workspace: { wksp_id }, resrc_id },
      relations: { workspace: true },
    });
  }
  // add new resource into workspace
  async addResource(
    wksp_id: string,
    resource: CreateResourceDTO,
    user: DecodeUser,
  ) {
    const wksp = await this.workspaceRepository.findOne({
      where: { wksp_id: wksp_id },
      relations: { resources: true },
    });
    if (!wksp) {
      throw new NotFoundException('Workspace not found');
    }
    const rsrc = this.resourceRepository.create({
      resrc_id: generateUUID('resource', wksp_id),
      resrc_name: resource.resrc_name,
      resrc_url: resource.resrc_url,
      crd_user_id: user.user_id,
      workspace: wksp,
    });
    wksp.resources.push(rsrc);
    return await Promise.all([
      this.resourceRepository.save(rsrc),
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
    const rsrc = await this.resourceRepository.findOne({
      where: { resrc_id, workspace: { wksp_id } },
      relations: { workspace: true },
    });
    if (!rsrc) {
      throw new NotFoundException('Resource not found');
    }
    await this.resourceRepository.upsert(
      { ...rsrc, ...resource, upd_user_id: user.user_id },
      ['resrc_id'],
    );
    return { success: true, message: 'Resource updated successfully' };
  }
  // remove resource
  async deleteResource(wksp_id: string, resrc_id: string, user: DecodeUser) {
    const rsrc = await this.resourceRepository.findOne({
      where: { resrc_id, workspace: { wksp_id } },
      relations: { workspace: true },
    });
    if (!rsrc) {
      throw new NotFoundException('Resource not found');
    }
    rsrc.deleted_user_id = user.user_id;
    await Promise.all([
      this.resourceRepository.save(rsrc),
      this.resourceRepository.softDelete(resrc_id),
    ]);
    return { success: true, message: 'Resource deleted successfully' };
  }
}
