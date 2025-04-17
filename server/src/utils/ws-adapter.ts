// ws-adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/users/passport/jwt.strategy'; 
import * as socketIo from 'socket.io';

export class WsAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: socketIo.ServerOptions): any {
    const jwtService = this.app.get(JwtService);
    const jwtStrategy = this.app.get(JwtStrategy);

    const server = super.createIOServer(port, options);

    server.use(async (socket, next) => {
      const token = socket.handshake.auth?.token;

      if (!token) return next(new Error('Token missing'));

      try {
        const payload = jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });

        const user = await jwtStrategy.validate(payload);
        socket.data.user = user;

        next();
      } catch (err) {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
