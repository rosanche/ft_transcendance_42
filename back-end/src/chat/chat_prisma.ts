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
import { form, pass, channel,ban, users} from 'src/chat/chat.gateway';
import { ChatFriend } from "src/chat/chatFriend";
import { ChatGateway } from "src/chat/chat.gateway";

@Injectable()
export class Chat_prisma {
    constructor(private Prisma: PrismaService, private  friend: ChatFriend  ,private authService: AuthService, @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway){}

}