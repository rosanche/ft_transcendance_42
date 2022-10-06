import {  Logger, Inject, forwardRef} from "@nestjs/common";
import {ConnectedSocket , SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from '../auth/guard';
import { User, Channel , Mp, Post, Ban} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from "../auth/auth.service";
import * as bcrypt from 'bcrypt';
import { GameGateway } from "src/game/game.gateway";
import { UserService } from "src/user/user.service";
import { Chat_Commons } from "src/chat/chat_commons";
import { ChatFriend } from "src/chat/chatFriend";

export type form = {
    idSend: number;
    idReceive: number;
    texte: string;
  };
  
  export type pass = {
    idChannel: number;
    name : string;
    password: string;
    private: boolean;
  };
  
export type channel = {
    id: number;
    name: string;
    private: boolean;
    user: boolean;
    admin: boolean;
    owner: boolean;
    password: boolean;
  };
  
export type ban = {
    mute_ban: string;
    idChannel: number;
    idUser: number;
    time: number;
    motif: string;
  };
  
  export type users = {
    id: number;
    pseudo: string;
    stastu: number;
    blocked: boolean;
    myblocked: boolean;
  };
  


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {

    

    constructor(private Prisma: PrismaService, private commons :  Chat_Commons, private  friend: ChatFriend  ,private authService: AuthService, @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');
    private iddd : Map<Number, Number[]> = new Map();
    private mp  = new Map<string, Number[]>;
    private mapIdSocket = new Map<string, number>();

    async afterInit(server : any) {
    }



    async  handleDisconnect(client: Socket) {
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        {
            this.iddd.delete(user.id);
            if (this.getAllSocketID(user.id).length <= 1)
            {
                this.sendAllStatus();
            }
            this.mapIdSocket.delete(client.id);         
        }
    }

    async handleConnection( client: Socket, ... args: any[]) {
        const user = await this.authService.getUserFromSocket(client);
        if (user) {
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
            this.iddd[user.id] = client.id;
            this.mapIdSocket.set(client.id, user.id);
            if (this.getAllSocketID(user.id).length == 1)
            {
                this.sendAllStatus();
            }
        }
        else
        {
            client.disconnect();
        }
     }
     
     async bandef(userid : number, idChannel : number) {

        return ( await this.Prisma.ban.findFirst({
            where:{
                iduser: userid,
                Channel:{
                    some:{
                        id : idChannel,
                    }
                },
                bandef: true
            }
        }) == null);
     }

    @SubscribeMessage('listchannels')
    async listChannels(client: Socket)
    {
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        {
            const  channels = await this.Prisma.channel.findMany({
                where:{
                    users:{
                    some: {
                    id: user.id,
                    }}
                },
                select:{
                    id: true,
                    createurID: true,
                    name: true,
                    private: true,
                    admin:{
                        where:{
                            id : user.id,
                        },
                        select:{
                        id : true
                        }
                    },
                    hash: true,
                }
            });
            var re = new Array<channel>();
            for (let i : number = 0; channels.length != 0 && channels[i]; ++i) {
                const ban  = await this.Prisma.ban.findMany({
                    where: {
                        active: true,
                        Channel: {
                            some: {
                                name: channels[i].name
                            }
                        },
                        iduser: user.id,
                        muteBan: "ban"
                    }
                });
                
                if (ban.length === 0 || await this.commons.banupdate(ban))
                    client.join(channels[i].name);
                re.push({id: channels[i].id, 
                        name: channels[i].name, 
                        private: channels[i].private, 
                        user: true,
                        admin: ((channels[i].admin.length !== 0)), 
                        owner: (channels[i].createurID === user.id)  ,
                        password: (channels[i].hash !== null)});
            }
            const  channels_2 = await this.Prisma.channel.findMany({
                where:{
                    NOT:{
                    users:{
                    some: {
                    id: user.id,
                    }}
                    },
                    private: false,
                }})
            for (let i : number = 0; channels_2[i]; ++i) {
                if (await this.bandef(user.id, channels_2[i].id))
                    re.push({id: channels_2[i].id, name: channels_2[i].name, private: channels_2[i].private, user: false ,admin: (false), owner : (false),password: (channels_2[i].hash !== null)});
            }
            this.wss.to(this.iddd[user.id]).emit('channels list',re);
        }
    }

    async quitChannel(userID : number, chanelID : number) {
        return await this.Prisma.channel.update({
            where: {
                id: chanelID
            },
            data: {
                users:{ 
                    disconnect:
                    {
                        id: userID
                    }
                },
                admin: { 
                    disconnect: {
                        id: userID
                    }
                }
            },
        });
    } 

    @SubscribeMessage('channelinit')
    async postChannel(client: Socket)
    {
        const user = await this.authService.getUserFromSocket(client);
        if (user !== null)
        {
            await this.wss.to(client.id).emit('info mp', await this.commons.listPostMyMps(user));
            await this.wss.to(client.id).emit('info channel', await this.commons.listPostsMyChannels(user));
        }           
    }

    // action channel base

    async checkNotIsChannel(userId : number, ChannelId : number, priv : boolean)
    {
        return  await this.Prisma.channel.findFirst({
            where: {
                NOT:{
                    users: {
                        some: {
                            id : userId
                        }
                    }
                },
                private: priv,
                id: ChannelId,
            }});
    }

    @SubscribeMessage('joins channel')
    async handleRoomJoin(client: Socket, chat: pass) {
       const user = await this.authService.getUserFromSocket(client);
       if (!user)
           return ;
       const channel : Channel = await this.checkNotIsChannel(user.id , chat.idChannel, false);
       if (channel !== null && (await this.bandef(user.id, channel.id)) && (channel.hash === null || await bcrypt.compare(chat.password, channel.hash)))
       {
           await this.Prisma.channel.update({
               where:{
                   id: channel.id,
               },
               data:{
                   users:{
                       connect:[{id: user.id,}]
                   }
               }
           });
            client.join(channel.name);
            await this.listChannels(client);
            this.wss.to(channel.name).emit('join channel true', {id: channel.id, 
                name: channel.name, 
                private: channel.private, 
                user: true,
                admin: false, 
                owner: false  ,
                password: (channel.hash !== null)})
                await this.postChannel(client);
        } 
        else 
           this.wss.to(this.iddd[user.id]).emit('join channel false', channel.id);
   }

    @SubscribeMessage('quit')
    async handleRoomLeave(client: Socket, idCha: number) {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return;
        const channelup = await this.Prisma.channel.findUnique({
            where: {
                id: idCha
            },
            select:{
                id: true,
                name: true,
                createurID: true,
                users:{
                    select:{
                        id:true,
                    }
                }
            }
        });
        if (!channelup)
            return;
        if (channelup.users.length === 1)
        {
            await this.Prisma.channel.delete({
                where:{
                    id: channelup.id,
                }
            });
        }
        else if (channelup.createurID !== user.id) {
            await this.quitChannel(user.id ,idCha);
        }
        else {
            this.wss.to(client.id).emit('owner no left', idCha);
        }
        client.leave(channelup.name);
        await this.listChannels(client);
        console.log(idCha);

        this.wss.to(client.id).emit('left chanel', idCha);
        await this.postChannel(client);
    }

    async verifChannelUsers(idCha : number, idUser : number) {
        return await this.Prisma.channel.findFirst({
            where:{
                id : idCha,
                users: {
                    some: {
                        id: idUser,
                    }
                }
            }
        });
    }

    async verifChanneladmin(idCha : number, idUser : number) {

        console.log(idCha);
        console.log(idUser);
        return await this.Prisma.channel.findFirst({
            where:{
                AND:[
                {id : idCha,},
                {
                users: {
                    some: {
                        id: idUser,
                    },
                },},
                {
                admin : {
                    some: {
                        id: idUser,
                    }
                }
                },
            ]
        }

        });
    }

    async verifChannelOwener(idCha : number, idCrea : number, idUser : number ) {
        return await this.Prisma.channel.findFirst({
            where:{
                id : idCha,
                users: {
                    some: {
                        id: idUser,
                    }
                },
                createurID: idCrea,
            }
        });
    }
    
    async creatPost(creatId: number, destByID : number,mpID : number,message : string ) {
       return await this.Prisma.post.create({
            data: {
                message: message,
                userID: creatId,
                destByID: destByID == 0 ? null: destByID,
                mpID: mpID == 0 ?  null : mpID,
            }
        });
    }

    @SubscribeMessage('channelToServer')
    async handleMessage(client: Socket, message: form) {
            console.log("oui")
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
        const cha = await this.verifChannelUsers(message.idReceive, user.id)
        if (!cha)
            return null;
        const ban  = await this.Prisma.ban.findMany({
            where: {
                active: true,
                Channel: {
                    some: {
                        id: message.idReceive
                    }
                },
                iduser: user.id,
            }
        }); 
        // // console.log("yo");
        if  (!ban || (await this.commons.banupdate(ban))) {
            console.log("yo");
                await this.creatPost(user.id, cha.id, 0, message.texte);
                this.wss.to(cha.name).emit('chatToClient', message);
                console.log("yo");
            }
    }

    //admin channel

    @SubscribeMessage('invite channel')
    async inviteCha(client: Socket,  info : {inviteId : number , channelId : number}) {
          console.log("debut")
     const user = await this.authService.getUserFromSocket(client);
     const user2 = await this.Prisma.user.findUnique({
         where:{
             id: info.inviteId,
         }
     });
      console.log(info);
      console.log("SSSS");
     if (!user || !user2)
         return;
         console.log("SSSS");
         console.log("SSSS");
     const channel = await this.verifChanneladmin(info.channelId, user.id);
     console.log(channel);
     if (!channel || await (!this.bandef(info.channelId, channel.id)))
     {
        console.log("error");
        console.log((!channel));
        console.log(await (!this.bandef(info.channelId, channel.id)));
             return;
     }
     console.log("c'est bon");
     await this.Prisma.channel.update({
             where: {
                     id: channel.id,
             },
             data: {
                 users: {
                     connect:[{id: user2.id}]
                 },
             }
         })
          // console.log("enfin")
         this.wss.to(client.id).emit('invite sucess');
         this.wss.to(this.iddd[user.id]).emit('join channel true');
    }

    @SubscribeMessage('list users channel')
    async listUserchanel(client: Socket, idChannel : number)
    {  
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return;
            // // console.log(idChannel);
        const Channel = await this.verifChanneladmin(idChannel, user.id);
        if (!Channel)
            return;
            const chanel_user = await this.Prisma.channel.findFirst({
                where:{
                    id: Channel.id
                },
                select:{
                    users:{
                    select:{
                        id : true,
                        }
                    }
                }
            }) 
            var a = Array<number>();
            await chanel_user.users.forEach(e => a.push(e.id))
            // // console.log("ouiuiuiuiu")
            // // console.log(a);
            client.emit('channel users', a);
        //return a;
    }

    @SubscribeMessage('blockedChannel')
    async blockedChannel(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        // // console.log(src);
        if (!user)
            return ;
        const cha = await this.Prisma.channel.findFirst({
            where: {
                id: src.idChannel, 
                users: {
                    some: {
                        id: src.idUser,
                    }
                },
                admin: {
                    some:{
                        id : user.id,
                    },
                    none:{
                        id: src.idUser,
                    }
                }
            },
        });
        if (cha) {
            if (src.mute_ban !== "ban" && src.mute_ban !== "mute")
                return;
            const ban = await this.Prisma.ban.create({
                data:
                {
                    timeBan: +src.time,
                    finshBan: Date.now() + 60000 * +src.time,
                    muteBan: src.mute_ban,
                    active: true,
                    iduser: src.idUser,
                    bandef: (src.mute_ban === 'ban' && src.time === 0),
                    Channel:{
                            connect : { 
                                id: cha.id,
                            }
                    }
                }
            });  
            if (src.mute_ban === "ban") {
                this.wss.in(this.iddd[src.idUser]).socketsLeave(cha.name);
                if (ban.bandef)
                await this.quitChannel(src.idUser, cha.id)
            }
            this.wss.to(cha.name).emit('you ban_mute', src);
            //this.wss.to(cha.name).emit('info ban_mute', src);
        }
    }
    
        // chef channel
    @SubscribeMessage('change owner')
    async newOwner(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);

        if (!user )
            return null;
        const cha = await this.verifChannelOwener(src.idChannel, user.id, src.idUser); 
        if (cha) {
                await this.Prisma.channel.update({
                    where:{
                    id : cha.id
                },
                data:{

                    createurID: src.idUser,
                    admin: { 
                        connect: {
                            id: src.idUser
                        }
                    }
                }
            });
        }
    }

    @SubscribeMessage('new admin')
    async newAdmin(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
            const Channel = await this.verifChannelOwener(src.idChannel, user.id, src.idUser); 
            if (!Channel)
                return null;
         await this.Prisma.channel.update({
            where:{
               name: Channel.name,
            },
            data: {
                admin: {
                    connect: [{
                        id: src.idUser
                    }]
                }
            }
        });
    }

    @SubscribeMessage('modif channel')
    async modifChan(client: Socket, chan : {idChannel : number, password : string})
    {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
            console.log(user);
            console.log(chan);
            const Channel = await this.verifChannelOwener(chan.idChannel, user.id, user.id);
            console.log(Channel)
        const hash : string = (chan.password == "") ?  null : await bcrypt.hash(chan.password, 3);
            if (!Channel)
                return null;
         await this.Prisma.channel.update({
            where:{
               id: chan.idChannel
            },
            data: {
                    hash,
                }
        });
    }

    
    @SubscribeMessage('me blocks')
    async userBlock(client: Socket) {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
        const block = await this.Prisma.user.findUnique({
            where:{
                id: user.id,
            },
            select:{
                myblocked:{ 
                    select: {
                        pseudo: true 
                    }
                }
            }
        });
        var re = new Array<string>();
            for (let i : number = 0; block.myblocked.length !== i; ++i) {
                re.push(block.myblocked[i].pseudo);
            }
        this.wss.to(client.id).emit("use info block", re)
    }


    @SubscribeMessage('block user')
    async blockedUser(client: Socket, src : number) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where: {
                id: src,
            }
        });
        if (user2 && user) {
             await this.Prisma.user.update({
                where: {
                    id : user.id,
                },
                data: {
                    myblocked:{
                        connect:[{
                        id : user2.id,
                        }]
                    }
                }
            });
            this.wss.to(client.id).emit("block user infos", src);
            return ;
        }
        return null;
    }

    @SubscribeMessage('deblockedUser')
    async deBlockedUser(client: Socket, src: number) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where: {
                id: src,
            }
        });
        if (user2 && user) {
             await this.Prisma.user.update({
                where: {
                    id : user.id,
                },
                data: {
                    myblocked:{
                        disconnect:[{
                        id : user2.id,
                        }]
                    }
                }
            });
            this.wss.to(client.id).emit("deblock use", src);
        }
        return null;
    }

    @SubscribeMessage('creatcha')
    async creatChan(client: Socket, chan : pass)
    {
        // // console.log("oui");
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return;
            // // console.log(user);
        const hash : string = (chan.password == "") ?  null : await bcrypt.hash(chan.password, 3);
            
            const channel = await this.Prisma.channel.create({
                data: {
                    name: chan.name,
                    private: chan.private ,
                    createurID: user.id,
                    admin: { 
                        connect: [{
                            id: user.id}
                        ]},
                    users: {
                        connect: [{
                            id: user.id
                        }]
                    },
                    hash,
                },
            })
            if (channel)
            {
                client.join(channel.name);
                if (!chan.private) {
                    this.wss.except(client.id).emit("new channel pub");
                    this.wss.to(client.id).emit("creat new channel success");
                    this.listChannels(client);
                }
                else
                {
                    this.listChannels(client);
                }
            }
            return;
    }

    sendAllGameInvitation(id: number)
    {
        console.log("sendAllGameInvitation" , id);
        const socketIds = this.getAllSocketID(id);
        const invitations = this.gameGateway.searchInvite(id);
        socketIds.forEach(sock => {
            console.log("sendAllGameInvitation" , id, sock);
            this.wss.to(sock).emit("list game invitations", invitations);
        });
        return;
    }

    @SubscribeMessage('Get Game Invitations')
    getGameInvitation(client: Socket)
    {
        const id = this.mapIdSocket.get(client.id);
        console.log("Get Game Invitation" , id);
        const invitations = this.gameGateway.searchInvite(id);
        client.emit("list game invitations", invitations);
        return;
    }

    @SubscribeMessage('Get Players')
    getPlayingUserID() : number[]
    {
      return [...this.gameGateway.getPlayingUser()];
    }

    @SubscribeMessage('Refuse Invitation')
    RefuseInvitation(client: Socket, id: number)
    {
        this.gameGateway.refuseGame(id);
        return;
    }


    getAllInvitationGame(inviteId: number)
    {
        return this.gameGateway.searchInvite(inviteId);
    }
    
    getAllSocketID(id: number) : string[]
    {
        let socketIds : string[] = [];
        this.mapIdSocket.forEach(function(val, key){
            if(val == id)
            {
                socketIds.push(key);
            }
          });
        return socketIds;
    }

    @SubscribeMessage('Get status')
    sendStatus(client: Socket)
    {
        const listStatus = this.getStatus();
        client.emit("list status", listStatus);
    }

    sendAllStatus()
    {
        const listStatus = this.getStatus();
        this.wss.emit("list status", listStatus);
        return;
    }

    getStatus(): {id: number,status: string}[]
    {
        const players : Set<number> = this.gameGateway.getPlayingUser();
        const onlines : Set<number> = this.getOnlineUser();
        let status : {id: number,status: string}[] = [];
        onlines.forEach(element => {
            if(players.has(element))
            {
                status.push({id: element, status: "playing"});
            }
            else
            {
                status.push({id: element, status: "online"});
            }
        });
        return status;
    }

    getOnlineUser() : Set<number>
    {
        let onlines : Set<number> = new Set<number>();
        this.mapIdSocket.forEach((val,key) => {
            onlines.add(val);
        });

        return onlines;
    }
    //friend action

    async emit_friend(isOk : boolean, id1 : number, id2 : number) {
        if (isOk)
        {
        this.wss.to(this.iddd[id1]).emit("request_friend", id2);
        this.wss.to(this.iddd[id2]).emit("request_friend",  id1);
        }
    }

    @SubscribeMessage('dem friend')
    async demFriend(client: Socket, id :  number )
    {
        // // // // console.log("demande amie", id)
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
        const users_2 = await this.Prisma.user.findFirst({
            where: {
                id : id,
            NOT:{
                OR:[
                {
                    friendBy: {
                        some:{
                        id :  user.id,
                        }
                    }
                },
                {
                    friendReqReceive: {
                        some:{
                            id :  user.id,
                        }
                    }
                },
                {
                    friendReqSend: {
                        some:{
                            id :  user.id,
                        }
                    }
                }],
            }
            },
        });
        if (users_2 == null)
            return null;  
        const users = await this.Prisma.user.update({
                where: { 
                    id: id 
                },
                data: {
                    friendReqReceive: { 
                        connect: [{
                            id: user.id
                        }]
                    },
                },
            });
            this.emit_friend(true, user.id, users_2.id);
    }

    @SubscribeMessage('sup dem friend')
    async supDemFriend(client: Socket, id : number)
    {
        const user = await this.authService.getUserFromSocket(client);
        const users_2 = await this.Prisma.user.findFirst({
            where: {            
                    id: id,
                    friendReqReceive: {
                        some:{
                            id :  user.id,
                        }
                    }
            },
        });
        if (users_2 === null)
            return null;  
        const users = await this.Prisma.user.update({
                where: { 
                    id: id 
                },
                data: {
                    friendReqReceive: { 
                        disconnect: [{
                            id: user.id
                        }]
                    },
                },
            });
            this.emit_friend(true, user.id, users_2.id);
    }

    async verifFriendReqSend(id1 : number, id2 : number) {
        return await this.Prisma.user.findFirst({
            where: {
                id: id2,
                friendReqSend: {
                    some: {
                        id :  id1,
                    }
                },
            },
        });
    }

    @SubscribeMessage('accept friend')
    async acceptFriend(client: Socket, id : number)
    {
        const user = await this.authService.getUserFromSocket(client)
        if (!user)
            return ;
        const user2 : User = await  this.verifFriendReqSend(user.id , id);
        if (user2 == null)
            return null;
        await this.Prisma.user.update({
            where: { 
                id: user2.id
            },
            data: {
                friendBy: {
                    connect: [{
                        id: user.id
                    }]
                },
                friendReqSend: {
                    disconnect: [{
                        id: user.id
                    }]}
            },
        });
        await this.Prisma.user.update({
            where: { 
                id: user.id 
            },
            data: {
                friendBy: {
                    connect: [{
                        id: user2.id
                    }]
                },
            },
        });
        this.emit_friend(true, user.id, user2.id);
    }

    @SubscribeMessage('refuse friend')
    async refuseFriend(client: Socket, id : number)
    {
        const user = await this.authService.getUserFromSocket(client)
        if (!user)
            return null;
        const user2 : User = await  this.verifFriendReqSend(user.id , id);
        if (user2 == null)
            return null;
        await this.Prisma.user.update({
            where: { 
                id: user2.id 
            },
            data: {
                friendReqSend: {
                    disconnect: [{
                        id: user.id
                    }]
                }
            },
        });
        this.emit_friend(true, user.id, user2.id);
    }

    @SubscribeMessage('sup friend')
    async supFriend(client: Socket, id : number)
    {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
        const user2 = await this.Prisma.user.findFirst({
            where: { 
                id: id,
                friendBy: {
                    some: {
                        id: user.id
                    }
                },
            }
        });
        if (user2 != null)
            this.emit_friend(await this.friend.supFriend(user, user2), user.id, user2.id);
    }

    @SubscribeMessage('message mp')
    async messageMP(client: Socket, mp : form)
    {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return null;
        const user2 = await this.Prisma.user.findFirst({
            where: {
                id :  mp.idReceive,
                myblocked:{
                    none:{id :user.id}
                },
                blocked:{
                    none:{id :user.id}
                },
                
                    
                },
        });
        if (!user || !user2)
            return;
        const  val = await this.Prisma.mp.findFirst({
            where: {
                OR : [
                    {
                        userID1: user.id,
                        userID2 : user2.id,
                    },
                    {
                        userID1: user2.id,
                        userID2 : user.id,
                    },
                ]

            }
        });
        if (val) {
            await this.Prisma.post.create({
                    data:{
                        mpID: val.id,
                        message: mp.texte,
                        userID: user.id,
                    }
                
            });
            this.wss.to(this.iddd[user.id]).emit('chatToClientMp', mp);
            if (user.id !=  user2.id)
            this.wss.to(this.iddd[user2.id]).emit('chatToClientMp', mp);
            return;
        }
        const cha = await this.Prisma.mp.create({
            data: {
               
                        userID1: user.id,
                        userID2 : user2.id,
                        blocked: false,
              user:{  
                connect:[
                    {id: user.id},
                    {id: user2.id}
                ]
            },
        }
           
        });
        await this.Prisma.post.create({
            data:{
                mpID: cha.id,
                message: mp.texte,
                userID: user.id,
            }
        });
            this.wss.to(this.iddd[user.id]).emit('chatToClient', mp);
            if (user.id !=  user2.id)
            this.wss.to(this.iddd[user2.id]).emit('chatToClient', mp);
            return;
    }


        ///// A BIENTOT SUP ?

    @SubscribeMessage('list users')
    async listMp(client: Socket) {
        const id : number = (await this.authService.getUserFromSocket(client)).id;
        if (id !== undefined) {
            const users : users[] = await this.commons.listMp(id)
            // // console.log(users);
            this.wss.to(client.id).emit("use info", users.find(e => e.id === id));
            this.wss.to(client.id).emit('user list', users);
        }
    }
}
