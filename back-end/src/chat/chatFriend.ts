import {  Logger, Inject, forwardRef, Injectable} from "@nestjs/common";
import {ConnectedSocket , SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from '../auth/guard';
import { User, Channel , Mp, Post, Ban} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from "../auth/auth.service";
import * as bcrypt from 'bcrypt';
import { GameGateway } from "src/game/game.gateway";
import { UserService } from "src/user/user.service";
import { form, pass, channel,ban} from 'src/chat/chat.gateway';

@Injectable()
export class ChatFriend {

    constructor(private Prisma: PrismaService, private authService: AuthService, @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway){}

    async supFriend(user: User, user2 : User)
    {
        await this.Prisma.user.update({ 
            where: { 
                id: user.id
            },
            data: {
                friendBy: {
                    disconnect: [{
                        id: user2.id
                    }]
                },
            },
        });
        await this.Prisma.user.update({ 
            where: { 
                id: user2.id
            },
            data: {
                friendBy: {
                    disconnect: [{
                        id: user.id
                    }]
                },
            },
        });
        return true;
    }
}