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
export class Chat_Commons {

    constructor(private Prisma: PrismaService, private  friend: ChatFriend  ,private authService: AuthService, @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway){}

    async banupdate(ban : Ban[])
    {
        let a : boolean = true;
        ban.forEach(async (Element) => {
            const u : number = Date.now()
            const c : number = Number(Element.finshBan);
            const v : number = ( u - c);
            // console.log(v);
            if (Element.bandef === false && Element.finshBan < Date.now()) {
                await this.Prisma.ban.update(
                    {
                        where: {
                            id : Element.id,
                        },
                        data: {
                            active: false,
                        }
                    });
            } 
            else {
                a = false;
            }
        });
        return a;
    }

    async listPostsMyChannels(user : User)
    {
        const cha = await this.Prisma.channel.findMany({
            where:{
                users: {
                    some: {
                        id : user.id
                    }
                }
            },
            select:{
                id : true,
                name: true,
                post:{
                    select: {
                        userID: true,
                        message: true,
                        createur:{
                            select: {
                                pseudo: true,
                            }
                    },
                }
            }
        }
        });
        var re = new Array<form>();
        for (let i : number = 0; cha.length != i; ++i) {
            const ban : Ban[] = await this.Prisma.ban.findMany({
                where: {
                    iduser: user.id,
                    active: true,
                    Channel: {
                        some: {
                            id: cha[i].id,
                        }
                    },
                    /*id: user.id,*/
                    muteBan: 'ban',
                }
            });
            // console.log(user.id);
            // console.log(ban);
            // console.log("aurevoir");
                if (!ban || (await this.banupdate(ban)))
                for (let n : number = 0; cha[i].post.length != n; ++n) {           
                     
                    re.push({idSend: cha[i].post[n].userID, idReceive: cha[i].id, texte: cha[i].post[n].message});
                }
            }
            // console.log(re);
            return re;
    }

    async listPostMyMps(user : User)
    {
        const mp = await this.Prisma.mp.findMany({
            where: {
                OR : [
                    {
                        userID1: user.id,
                        
                    },
                    {
                        userID2: user.id,
                    },
                ],
                blocked: false,
        },
        select: {
            post:{
                select: {
                    message: true,
                    userID: true,
                    createur: {
                        select: {
                            pseudo: true,
                        }
                    },
                }
            },
            user: {
                select: {
                    pseudo: true,
                    id: true,
                }
            }
        }
    });
    var re = new Array<form>();
            let  na : form;

            for (let i : number = 0; mp.length != i; ++i) {
                if ( mp[i].user[0].id === user.id && mp[i].user.length == 2)
                        na = {idSend: user.id, idReceive: mp[i].user[1].id, texte: ""}
                    else if (mp[i].user.length > 0)
                    {
                        na = {idSend: user.id, idReceive: mp[i].user[0].id, texte: ""}
                    }
                        for (let n : number = 0; mp[i].post.length != n; ++n) {

                    na = { idSend: mp[i].post[n].userID, idReceive: na.idReceive, texte: mp[i].post[n].message}
                    re.push(na);
                }
            }
             return re;
    }

    async listMp(id: number)
    {
        const user = await this.Prisma.user.findUnique({
            where:{
                id : id,
            },
            select: {
                id: true,
                pseudo: true,
                myfriends:{
                    select:
                    {
                        id :true,
                    }
                },
                friendReqSend: {
                select: 
                {
                    id :true,
                }
            },
                friendReqReceive: {
                select:
                {
                    id :true,
                }
            },
            blocked: {
                select: 
                {
                    id :true,
                }
            },
            myblocked: {
                select:
                {
                    id :true,
                }
            },
            }
        })
        
      
        if (user)
        {
            const users = await this.Prisma.user.findMany({});
            var re = new Array<users>();
            
            for (let i : number = 0; users.length != i; ++i) {
                // // // console.log(user);
                if (await (user.myfriends.length !== 0 && user.myfriends.find((el) => el.id === users[i].id) !== undefined))
                re.push({
                    id: users[i].id, 
                    pseudo: users[i].pseudo, 
                    stastu: 1,
                blocked: (await user.myblocked.find(el => el.id === users[i].id) != undefined),
                myblocked: (await user.blocked.find(el => el.id === users[i].id) != undefined) });
                else if (await (user.friendReqSend.length !== 0 && user.friendReqSend.find((el) => el.id === users[i].id) !== undefined))
                 re.push({
                    id: users[i].id, 
                    pseudo: users[i].pseudo, 
                    stastu: 2,
                blocked: (await user.myblocked.find(el => el.id === users[i].id) != undefined),
                myblocked: (await user.blocked.find(el => el.id === users[i].id) != undefined) });
                else if (await (user.friendReqReceive.length !== 0 && user.friendReqReceive.find((el) => el.id === users[i].id) !== undefined))
                re.push({
                    id: users[i].id, 
                    pseudo: users[i].pseudo, 
                    stastu: 3,
                blocked: (await user.myblocked.find(el => el.id === users[i].id) != undefined),
                myblocked: (await user.blocked.find(el => el.id === users[i].id) != undefined) });
                else
                re.push({
                    id: users[i].id, 
                    pseudo: users[i].pseudo, 
                    stastu: 0,
                blocked: (await user.myblocked.find(el => el.id === users[i].id) != undefined),
                myblocked: (await user.blocked.find(el => el.id === users[i].id) != undefined) });

            }
            return re; 
        }
    }
}