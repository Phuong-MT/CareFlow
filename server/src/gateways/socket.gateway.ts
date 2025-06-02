import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  import { Data } from './type';
  import {QueueService} from 'src/queue/queue.service'
  import { SocketState } from './type';
import { QueueEnum } from 'src/common/commonEnum';
import { subscribe } from 'diagnostics_channel';
  @WebSocketGateway(3002,{
    // cors: process.env.NEXT_PUBLIC_CLIENT_URL || 'https://localhost:3000',
    cors: '*'
  })
  export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    constructor(private readonly queueService: QueueService) {}
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketGateway');
  
    afterInit() {
      this.logger.log('WebSocket Gateway initialized');
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }


    @SubscribeMessage(SocketState.JOIN_ROOM)
    async handleJoinRoom(
      @ConnectedSocket() client: Socket,
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: { tenantCode: string; eventId: string; locationId: string }
    ) {
      const { tenantCode, eventId, locationId } = data;
      const roomId = `${tenantCode}:${eventId}:${locationId}`;
      client.join(roomId);
      const queue = await this.queueService.getQueueState(data)
      this.logger.log(`Client ${client.id} joined room ${roomId}`);
      client.emit(SocketState.QUEUE_STATE,  queue);
      return { success: true, message:`Client ${client.id} joined room ` };
    }

    @SubscribeMessage(SocketState.NEW_QUEUE_CHECK_IN)
    async handleNewQueueCheckin(
      @ConnectedSocket() client: Socket,
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: {
        tenantCode: string;
        eventId: string;
        locationId: string;
        name: string;
      }
    ) {
      const userId = client.data.user.id;
      const roomId = `${data.tenantCode}:${data.eventId}:${data.locationId}`;
      const exists = await this.queueService.findOneUser({userId, eventId: data.eventId, locationId: data.locationId, tenantCode: data.tenantCode});
      if (exists) {
        return { success: false, message: 'Already in queue' };
      }
      const queueEntry = await this.queueService.joinQueue(userId,
         {tenantCode: data.tenantCode, eventId: +data.eventId, locationId: +data.locationId, name: data.name})
         const queueData = {
          userId: queueEntry.userId,
          nameUser: queueEntry.nameUser,
          status: queueEntry.status,
          position: queueEntry.position,
          queueDate: queueEntry.queueDate,
        };
      // ✅ Broadcast cho toàn room
      this.server.to(roomId).emit(SocketState.NEW_QUEUE_RECEiVED,
        queueData
      );

      return { success: true, message: 'New check_in received' };
    }
  @SubscribeMessage(SocketState.CALL_NEXT)
  async handleCallNext(
    @MessageBody() data: { 
        pocLocationId: number,
        tenantCode: string;
        eventId: string;
        locationId: string;
     },
    @ConnectedSocket() client: Socket,
  ) {
    const { pocLocationId } = data;
    const roomId = `${data.tenantCode}:${data.eventId}:${data.locationId}`;
    const nextInQueue = await this.queueService.findFirstWaiting(data.tenantCode, data.eventId, data.locationId);

    if (!nextInQueue) {
      this.logger.warn('No one in the queue');
      client.emit(SocketState.CALL_NEXT_ERROR, { message: 'Không có người trong hàng đợi' });
      return;
    }

    await this.queueService.updateStatus(nextInQueue.id, pocLocationId,QueueEnum.SERVING);

      this.server.to(roomId).emit(SocketState.CALL_NEXT_SUCCESS, {
        data:{
          userId: nextInQueue.userId,
          nameUser: nextInQueue.nameUser,
          pocLocationId: pocLocationId,
          message: 'Đến lượt bạn, vui lòng di chuyển tới vị trí được chỉ định.',
        },
      });

    const updatedQueue = await this.queueService.getQueueState({tenantCode: data.tenantCode,
                                                                eventId: data.eventId,
                                                                locationId: data.locationId});
    this.server.emit(SocketState.QUEUE_STATE_UPDATE, updatedQueue);
  }

  @SubscribeMessage(SocketState.HANDLE_SUCCESS)
  async handleSuccess(
    @MessageBody() data: {queueId: number ; tenantCode: string; eventId: string; locationId: string, pocLocationId: number},
    @ConnectedSocket() client: Socket,
  ) {
    const { queueId, tenantCode, eventId, locationId, pocLocationId } = data;
    console.log(data)
    const roomId = `${tenantCode}:${eventId}:${locationId}`;
    this.logger.log(`Client ${client.id} handled success for queue ${queueId}`);
    await this.queueService.updateStatus(queueId,pocLocationId ,QueueEnum.SUCCESS)
    const updatedQueue = await this.queueService.getQueueState({tenantCode, eventId, locationId});
    this.server.to(roomId).emit(SocketState.QUEUE_STATE_UPDATE, { updatedQueue });
  }
}