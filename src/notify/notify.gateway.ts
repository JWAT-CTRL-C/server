import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { NotifyService } from './notify.service';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { UpdateNotifyDto } from './dto/update-notify.dto';

@WebSocketGateway(8081, {
  transports: ['websocket'],
  namespace: 'notification',
})
export class NotifyGateway {
  constructor(private readonly notifyService: NotifyService) {}

  @SubscribeMessage('createNotify')
  create(@MessageBody() createNotifyDto: CreateNotifyDto) {
    return this.notifyService.create(createNotifyDto);
  }

  @SubscribeMessage('findAllNotify')
  findAll() {
    return this.notifyService.findAll();
  }

  @SubscribeMessage('findOneNotify')
  findOne(@MessageBody() id: number) {
    return this.notifyService.findOne(id);
  }

  @SubscribeMessage('updateNotify')
  update(@MessageBody() updateNotifyDto: UpdateNotifyDto) {
    return this.notifyService.update(updateNotifyDto.id, updateNotifyDto);
  }

  @SubscribeMessage('removeNotify')
  remove(@MessageBody() id: number) {
    return this.notifyService.remove(id);
  }
}
