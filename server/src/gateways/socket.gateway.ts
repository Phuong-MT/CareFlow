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
      client.to(roomId).emit(SocketState.NEW_QUEUE_RECEiVED, {
        queueData
      });

      return { success: true, message: 'New check_in received' };
    }

  }