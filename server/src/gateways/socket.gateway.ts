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
  @WebSocketGateway(3002,{
    // cors: process.env.NEXT_PUBLIC_CLIENT_URL || 'https://localhost:3000',
    cors: '*'
  })
  export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
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
  
    // @SubscribeMessage('join_room')
    // async handleJoinRoom(
    //   @ConnectedSocket() client: Socket,
    //   @MessageBody() eventCode: string,
    // ) {
    //   await client.join(eventCode);
    //   this.logger.log(`Client ${client.id} joined room: ${eventCode}`);
  
    //   return { success: true, message: `Joined room ${eventCode}` };
    // }
  
    // @SubscribeMessage('leave_room')
    // async handleLeaveRoom(
    //   @ConnectedSocket() client: Socket,
    //   @MessageBody() eventCode: string,
    // ) {
    //   await client.leave(eventCode);
    //   client.broadcast.emit('user-join',{
    //     message: 'user disconnect the room',
    //   })
    //   this.logger.log(`Client ${client.id} left room: ${eventCode}`);
    //   return { success: true, message: `Left room ${eventCode}` };
    // }

    @SubscribeMessage('join_room')
    handleJoinRoom(
      @ConnectedSocket() client: Socket,
      @MessageBody()
      data: Data,
    ) {
      const {tenantCode, eventId, locationId} = data
      console.log(`${tenantCode}: ${eventId} : ${locationId}`)
      const roomId = `${tenantCode}:${eventId}:${locationId}`;
      this.logger.log(`roomid: ${roomId}`)
      client.join(roomId);
      this.logger.log(`Client ${client.id} joined room ${roomId}`);
      return { success: true, room: roomId };
    }

    @SubscribeMessage('leave_room')
    handleLeaveRoom(
      @ConnectedSocket() client: Socket,
      @MessageBody()
      data: { tenantCode: string; eventId: string; locationId: string },
    ) {
      const roomId = `${data.tenantCode}:${data.eventId}:${data.locationId}`;
      client.leave(roomId);
      this.logger.log(`Client ${client.id} left room ${roomId}`);
      return { success: true };
    }

    @SubscribeMessage('new_checkin')
    handleNewCheckin(
      @ConnectedSocket() client: Socket,
      @MessageBody()
      checkinData: {
        tenantCode: string;
        eventId: string;
        locationId: string;
       // guestInfo: any;
      },
    ) {
      const roomId = `${checkinData.tenantCode}:${checkinData.eventId}:${checkinData.locationId}`;

      this.server.to(roomId).emit('new_checkin_received', checkinData);

      this.logger.log(
        `Broadcast checkin to room ${roomId}: ${JSON.stringify(checkinData)}`,
      );

      return { success: true };
    }

    // @SubscribeMessage('new_checkin')
    // handleNewCheckin(
    //   @ConnectedSocket() client: Socket,
    //   @MessageBody() checkinData: GuestResponse,
    // ) {
    //   client
    //     .to(checkinData.guestInfo.eventCode)
    //     .emit('new_checkin_received', checkinData);
    //   this.logger.log(`New checkin: ${JSON.stringify(checkinData)}`);
    //   return { success: true, message: `New checkin received` };
    // }
  }