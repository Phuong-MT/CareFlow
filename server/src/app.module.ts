import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
// table
import { User } from './users/entities/user.entity';
import {Justit} from './just-it/entities/just-it.entity'
import { Tenant } from './tenant/entities/tenant.entity';
import { Queue } from './queue/entities/queue.entity';
import { Event } from './event/entities/event.entity';
import { Location } from './location/entities/location.entity';
// module
import { UsersModule } from './users/users.module';
import { JustItModule } from './just-it/just-it.module';
import { TenantModule } from './tenant/tenant.module';
import { QueueModule } from './queue/queue.module';
import { EventModule } from './event/event.module';
import { LocationModule } from './location/location.module';
import { SocketGateway } from './gateways/socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'format'}`, 
      isGlobal: true, 
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        models: [User, Justit, Tenant, Queue, Event, Location],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature([Tenant, User, Queue, Event, Location]),
    UsersModule,
    JustItModule,
    TenantModule,
    QueueModule,
    EventModule,
    LocationModule
  ],
  controllers: [AppController],
  providers: [AppService,SocketGateway],
})
export class AppModule {}
