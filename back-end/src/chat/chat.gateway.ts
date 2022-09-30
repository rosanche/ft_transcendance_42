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

type form = {
    idSend: number;
    idReceive: number;
    texte: string;
  };
  
  type pass = {
    idChannel: number;
    name : string;
    password: string;
    private: boolean;
  };
  
  type channel = {
    id: number;
    name: string;
    private: boolean;
    user: boolean;
    admin: boolean;
    owner: boolean;
    password: boolean;
  };
  
  type ban = {
    mute_ban: string;
    idChannel: number;
    idUser: number;
    time: number;
    motif: string;
  };
  
  type users = {
    id: number;
    pseudo: string;
    stastu: number;
    blocked: boolean;
    myblocked: boolean;
  };
  


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {

    constructor(private Prisma: PrismaService, private authService: AuthService, @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');
    private iddd : Map<Number, Number[]> = new Map();
    /*private banactive  = new  Map<Number, Ban >();
    private muteactive = new Map<Number, Map<Number, Boolean> >();*/
    private mp  = new Map<string, Number[]>;
    private mapIdSocket = new Map<string, number>();

    

   /* async ban_or_not(cha : string, id: number) {
        const ban = await this.Prisma.ban.findMany({
            where:{
                active: true,
                Channel: {
                    some: {
                        name: cha,
                    }
                },
                id: id,
            }
        });
        if(cha)
            return;
        this.banactive.get(cha).set(id ,false);
        this.muteactive.get(cha).set(id ,false);
        if (!ban)
            return  true;
        for (let i : number = 0; ban[i]; i++) {
            if (ban[i].finshBan < Date.now()) {
                await this.Prisma.ban.update({
                    where: {
                        id: ban[i].id,
                    },
                    data: {
                        active: false,
                    }
                });
            } 
            else {
                if (ban[i].muteBan == "ban")
                    this.banactive.get(cha).set(id ,true);
                else
                    this.muteactive.get(cha).set(id ,true);
            }
        }
        return !(this.banactive.get(cha).get(id) || this.muteactive.get(cha).get(id));
    }

    async isbancha(user : User,  room : string)
    {
        return await !(this.ban_or_not(room, user.id) || this.banactive.get(room).get(user.id)) 
    }

    async isbanmute(user : User,  room : string)
    {
        return await !(this.ban_or_not(room, user.id) || this.muteactive.get(room).get(user.id)) 
    }*/

    async afterInit(server : any) {
        // this.logger.log('initilized!');
        // const cha  = await this.Prisma.channel.findMany({
        //     select: {
        //         id: true,
        //         name: true,
        //         users: {
        //             select: {
        //                 id: true,
        //                 pseudo: true,
        //                 }
        //             },
        //         }
        // });
        // // console.log(cha);
      /*  for (let i :number = 0; cha[i]; i++) {
            const a = new Map<number, Boolean>()
          //  await this.banactive.set(cha[i].name, new Map<Number, Boolean>());
           // await this.muteactive.set(cha[i].name, new Map<Number, Boolean>());
            for (let n :number = 0; cha[i].users[n]; n++) {
             //   await this.banactive.get(cha[i].name).set(cha[i].users[n].id, false)
               // // console.log(this.banactive.get(cha[i].name).get(cha[i].users[n].id));
                t//his.ban_or_not(cha[i].name, cha[i].users[n].id)
            }
            // console.log(`${cha[i].name} ha oui d'accord c'est toi`);
        }*/
    }

    async banupdate(ban : Ban[])
    {
        let a : boolean = true;
        ban.forEach(async (Element) => {
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

    async  handleDisconnect(client: Socket) {
        this.logger.log(`Method not implmented. ${client.id}`);
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        {
            this.iddd.delete(user.id);
            this.mapIdSocket.delete(client.id);
        }
    }

    async handleConnection( client: Socket, ... args: any[]) {
        const user = await this.authService.getUserFromSocket(client);
        // console.log(`connection: ${user}`);
        if (user) {
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
            this.iddd[user.id] = client.id;
            this.mapIdSocket.set(client.id, user.id);
        //    client.join("general");
          //  client.to("general").emit('joinedRoom', "typescript")
        }
      /*  else {
            client.to("typescrsipt").emit('joinedRoom', "typescript")
            client.disconnect();
        }*/
     }
     


    async mpcha(user: User,client: Socket, user2: User) {
        const channel =  await this.Prisma.mp.findFirst({
            where: {
                OR: [{ 
                        userID1: user.id,
                        userID2: user2.id
                    },
                    {
                        userID1: user2.id,
                        userID2: user.id
                    }],
            }
        });
        if (channel)
            return channel;
        return await this.Prisma.mp.create({
            data: {
                user: {
                    connect: [{
                        id: user.id,
                    },
                    {
                        id: user2.id 
                    }],
                },
                userID1: user.id,
                userID2:  user2.id,
                blocked: false,
            }
        });
    }
    
    /// init chan-mp
    /*@SubscribeMessage('joindm')
    async handleRoomdm(client: Socket, name: string) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findFirst({
            where: {
                pseudo: name,
                NOT: {
                    OR: [{
                        blocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    },
                    {
                        myblocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    }]
                }
            }
        });
        if (user === null || user2 === null)
            return ;
        const channelup = await this.mpcha(user, client, user2);
        this.mp[0] = channelup.userID1;
        this.mp[1] = channelup.userID2;
        client.emit('joinedRoom', 'dm');
        this.wss.to(this.iddd[user2.id]).emit('joinedRoom', 'dm');
     }*/

    /*
    @SubscribeMessage('mpToServer')
    async handleMessageMp(client: Socket, message:  ) {
        const user = await this.authService.getUserFromSocket(client);
        message.sender = user.pseudo;
        const user2 = await this.Prisma.user.findFirst({
            where: {
                pseudo: message.sender,
                NOT: {
                    OR: [{
                        blocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    },
                    {
                        myblocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    }]
                }
            }
        });
        if (user2)
        {
            this.wss.to(this.iddd[+this.mp[0]][0]).emit('chatToClient', message );
            this.wss.to(this.iddd[+this.mp[1]][0]).emit('chatToClient', message );
        }
    }*/

    @SubscribeMessage('pubchannels')
    async pubchannels(client: Socket) {
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        {
            const  channels = await this.Prisma.channel.findMany({
                where:{
                    NOT:{
                    users:{
                    some: {
                    id: user.id,
                    }}
                    },
                    private: false,
                }})
                var re = new Array<channel>();
            for (let i : number = 0; channels[i]; ++i) {
                re.push({id: channels[i].id, name: channels[i].name, private: channels[i].private, user: false ,admin: (false), owner : (false),password: (channels[i].hash !== null)});
                // console.log(` oui enfin c'est toi oupa  ${user.id} et ${na.admin}`);
            }
            console.log(re)
            this.wss.to(this.iddd[user.id]).emit('channels pub', re);
            }
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
            })
    //        if (!channels)
     //           return;
            var re = new Array<channel>();
            let  na : channel;
            for (let i : number = 0; channels[i]; ++i) {
                // console.log(channels[i].admin);
                const ban  = await this.Prisma.ban.findMany({
                    where: {
                        active: true,
                        Channel: {
                            some: {
                                name: channels[i].name
                            }
                        },
                        id: user.id,
                        muteBan: "Ban"
                    }
                });
            if (ban && await this.banupdate(ban)) {
                client.join(channels[i].name);
                re.push({id: channels[i].id, name: channels[i].name, private: channels[i].private, user: true,admin: ((channels[i].admin.length !== 0)), owner: (channels[i].createurID === user.id)  ,password: (channels[i].hash !== null)});
                }
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
                re.push({id: channels_2[i].id, name: channels_2[i].name, private: channels_2[i].private, user: false ,admin: (false), owner : (false),password: (channels_2[i].hash !== null)});
                // console.log(` oui enfin c'est toi oupa  ${user.id} et ${na.admin}`);
            }
            // console.log(`aouit ${re} 1000`);
            // console.log(re);
            this.wss.to(this.iddd[user.id]).emit('channels list',re);
        }
    }

    @SubscribeMessage('channelinit')
    async postChannel(client: Socket)
    {
        const user = await this.authService.getUserFromSocket(client);
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
        const mp = await this.Prisma.mp.findMany({
                where: {
                    OR : [
                        {
                            userID1: user.id,
                            
                        },
                        {
                            userID2: user.id,
                        },
                    ]
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
        for (let i : number = 0; cha.length != i; ++i) {
                for (let n : number = 0; cha[i].post.length != n; ++n) {           
                    na = {idSend: cha[i].post[n].userID, idReceive: cha[i].id, texte: cha[i].post[n].message}
                    re.push(na);
                }
            }
            for (let i : number = 0; mp.length != i; ++i) {
                if ( mp[i].user[0].id === user.id && mp[i].user.length == 2)
                        na = {idSend: user.id, idReceive: mp[i].user[1].id, texte: ""}
                    else if (mp[i].user.length > 0)
                    {
                        // console.log(mp[i].user);
                        na = {idSend: user.id, idReceive: mp[i].user[0].id, texte: ""}
                    }
                        for (let n : number = 0; mp[i].post.length != n; ++n) {
                    // console.log(mp[i].post[n]);
                    na = { idSend: mp[i].post[n].userID, idReceive: na.idReceive, texte: mp[i].post[n].message}
                    re.push(na);
                }
            }
            
           // console.log(re)
            this.wss.to(this.iddd[user.id]).emit('info channel', re); 
        }

        @SubscribeMessage('list mps')
        async listUser(client: Socket)
        {
            const user = await this.authService.getUserFromSocket(client);
            if (user)
            {
                var re = new Array<channel>();
                const mps = await this.Prisma.mp.findMany({
                    where:{
                        OR:[
                            {
                                userID1: user.id,
                            },
                            {
                                userID2: user.id,
                            }
                        ]
                    },
                    select:{
                        user:{
                            select:{
                            pseudo: true,
                            id: true,
                            }
                        }
                    },
                 });
                 // console.log(mps[0]);
                for (let i : number = 0; mps.length != i; ++i) {
                    if (mps[i].user[0].pseudo === user.pseudo && mps[i].user.length == 2)
                    {
                        // console.log(mps[i]);
                        re.push({id: -1, name: mps[i].user[1].pseudo , private: true, user : true,admin: false, owner: false  ,password: false})  
                    }
                    else
                        re.push({id: -1, name: mps[i].user[0].pseudo , private: true, user : true ,admin: false, owner: false  ,password: false});

                }
                this.wss.to(client.id).emit('mp list', re); 
            }
        }

        @SubscribeMessage('list users')
        async listMp(client: Socket)
        {
            const user = await this.Prisma.user.findUnique({
                where:{
                    id :  (await this.authService.getUserFromSocket(client)).id,
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
                    // console.log(user);
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
                    if (users[i].id == user.id)
                    {
                        console.log(re[i])
                        this.wss.to(client.id).emit("use info", re[i]);
                    }
                }
                this.wss.to(client.id).emit('user list', re); 
            }
        }

    // action channel base

    @SubscribeMessage('joins channel password')
    async handleRoomJoinPassword(client: Socket, chat: pass) {
       const user = await this.authService.getUserFromSocket(client);
       if (!user)
           return ;
       const channel = await this.Prisma.channel.findFirst({
           where: {
               NOT:{
                   users: {
                       some: {
                           id : user.id
                       }
                   },
                   hash: null,
               },
               id: chat.idChannel,
           }
       });
       if (channel !== null && await bcrypt.compare(chat.password, channel.hash))
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
           })
           client.join(chat.name);
           // console.log('renvoie');
           const a : channel =  await {id: channel.id, name: channel.name, private: channel.private , user: true,admin: (false), owner: false, password: true}
           // console.log(this.iddd[user.id]);
           this.listChannels(client);
          // this.wss.to(this.iddd[user.id]).emit('join channel true', a);
       }
       else
       {
           // console.log('je suis une porte');
           this.wss.to(this.iddd[user.id]).emit('join channel false password', chat);
       }
       return ; 
   }

    @SubscribeMessage('joins channel')
    async handleRoomJoin(client: Socket, room: string) {
       const user = await this.authService.getUserFromSocket(client);
       if (!user)
           return ;
       const channel = await this.Prisma.channel.findFirst({
           where: {
               NOT:{
                   users: {
                       some: {
                           id : user.id
                       }
                   }
               },
               name: room,
               hash: null,
           },
           select: {
            name: true,
            id : true,
            private: true,
            post :{
            select:{
                message: true,
                createur: {
                    select:{
                        pseudo: true,
                        id: true
                    }
                }
                },
            }
           }
       });
       if (channel !== null)
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
           })
           client.join(room);
           const a : channel =  await {id: channel.id, name: channel.name, private: channel.private , user : true,admin: (false), owner: false, password: false}
           this.listChannels(client);
           //this.wss.to(this.iddd[user.id]).emit('join channel true', a);
           var re = new Array<form>();
            let  na : form;
        
        for (let i : number = 0; channel.post.length != i; ++i) {
            na = { idSend: channel.post[i].createur.id, idReceive: channel.id, texte: channel.post[i].message}
            re.push(na);
        this.wss.to(this.iddd[user.id]).emit('message join channel', re)}
        } 
        else {
           this.wss.to(this.iddd[user.id]).emit('join channel false', room);
       }
       return ; 
   }

   @SubscribeMessage('invite channel')
   async inviteCha(client: Socket, chat : ban) {
    const user = await this.authService.getUserFromSocket(client);
    const user2 = await this.Prisma.user.findUnique({
        where:{
            id: chat.idUser,
        }
    });
    if (!user || user2)
        return;
    const channel = await this.Prisma.channel.findFirst({
        where: {
            id: chat.idChannel,

                        admin: {
                            some: {id: user.id}
                        },
        },
    });
    // console.log(channel);
    if (!channel)
            return;
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
        this.wss.to(client.id).emit('invite sucess');
        //this.wss.to(this.iddd[user.id]).emit('join channel true', a);
   }

    @SubscribeMessage('quit')
    async handleRoomLeave(client: Socket, room: channel) {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
        {
            return;
        }
        // console.log("oui");
        const channelup = await this.Prisma.channel.findUnique({
            where: {
                name: room.name
            },
            select:{
                id: true,
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
            })
            client.leave(room.name);
            // console.log(room)
            this.wss.to(client.id).emit('left chanel', room)
            return;
        }
        if (channelup.createurID !== user.id)
        {
            await this.Prisma.channel.update({
                where: {
                    name: room.name
                },
                data: {
                    users:{ 
                        disconnect:
                        {
                            id: user.id
                        }
                    },
                    admin:{ 
                        disconnect:
                        {
                            id: user.id
                        }
                    }
                },
            });
            client.leave(room.name);
            // console.log(room)
            this.wss.to(client.id).emit('left chanel', room)   
            return;
        }
        this.wss.to(client.id).emit('owner no left', room);
    }

    @SubscribeMessage('channelToServer')
    async handleMessage(client: Socket, message: form) {
        const user = await this.authService.getUserFromSocket(client);
         console.log(`bonjour le monde ${user.pseudo}`);
      //  this.wss.emit('chatToClient', {channel: message.channel, pseudo: user.pseudo, texte: message.texte }); 
        const ban  = await this.Prisma.ban.findMany({
            where: {
                active: true,
                Channel: {
                    some: {
                        id: message.idReceive
                    }
                },
                id: user.id,
            }
        });
        const cha = await this.Prisma.channel.findFirst({
            where:{
                id : message.idReceive,
                users: {
                    some: {
                        id: user.id,
                    }
                }
            }
        });

        if (!cha)
            return null;
           // const test : Boolean = 
            if  (!ban || (await this.banupdate(ban))) {
            
                console.log(`bonjour le monde ${user.pseudo}`);
           await this.Prisma.post.create({
                data: {
                    message: message.texte,
                    userID: user.id,
                    destByID: cha.id
                }
            });
            /*
            const block =  await this.Prisma.user.findUnique({
                where: {
                    id: user.id,
                },
                select: {
                    blocked: {
                        select: {
                            pseudo : true,
                        }
                    }
                }
            });*/
            // console.log(`bonjour le monde ${user.pseudo} et ${message.idReceive}`);
            this.wss.to(cha.name).emit('chatToClient', message); 
            }
    }

    //admin channel

    @SubscribeMessage('blockedChannel')
    async blockedChannel(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return "";
        const cha = await this.Prisma.channel.findFirst({
            where: {
                id: src.idUser, 
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
        const user2 = await this.Prisma.user.findUnique({
            where:{
                id: src.idUser
                
            }
        })
        if (!user2)
        return;
        // console.log("AAAkgogjAAA")
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
                    iduser: user2.id,
                    bandef: (src.mute_ban === "ban" && src.time === 0)
                }
            });  
            if (src.mute_ban === "ban") {
                this.wss.in(this.iddd[src.idUser]).socketsLeave(cha.name);
                if (ban.bandef)
                await this.Prisma.channel.update({
                    where:{
                        name: cha.name,
                    },
                    data: {
                        users:{ disconnect:{
                            id: src.idUser,
                        }}
                    }
                })
            }
            // console.log(ban.finshBan);
            this.wss.to(cha.name).emit('you ban_mute', src);
            //this.wss.to(cha.name).emit('info ban_mute', src);
        }
    }
    
        // chef channel
    @SubscribeMessage('change owner')
    async newOwner(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where:{
                id : src.idUser
            }
        })
        // console.log("AAAA");
        if (!user || !user2)
            return "";
        const cha = await this.Prisma.channel.findFirst({
            where: {
                id: src.idChannel, 
                users: {
                    some: {
                        id : user2.id,
                    }
                },
                createurID: user.id
            },
        });
        
        if (cha) {
                const chas = await this.Prisma.channel.update({
                    where:{
                    id : cha.id
                },
                data:{

                    createurID: user2.id,
                    admin: { 
                        connect: {
                            id: user2.id
                        }
                    }
                }
            });
            // console.log(chas);
            //this.wss.to(client.id).emit('you ban_mute', src);
            //this.wss.to(cha.name).emit('info ban_mute', src);
        }
    }

    @SubscribeMessage('new admin')
    async newAdmin(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where:{
                id: src.idUser,
            }
        });
        if (!user2)
            return null;
            const Channel =  await this.Prisma.channel.findFirst({
                where:{
                    AND: [{
                        id: src.idChannel,
                    },
                    {
                        users: {
                            some:{
                                id: user2.id,
                            }
                        }
                    },
                    {
                        createurID: user.id, 
                    }]
                }
            });
            if (!Channel)
                return null;
         await this.Prisma.channel.update({
            where:{
               name: Channel.name,
            },
            data: {
                admin: {
                    connect: [{
                        id: user2.id
                    }]
                }
            }
        });
        //this.wss.to(client.id).emit('succes id');
        //this.wss.emit('new adm')
    }
    // action user

    /*@SubscribeMessage('me info')
    async infoUser(client: Socket) {
        const user = await this.authService.getUserFromSocket(client);

        this.wss.to(client.id).emit("use info", user.pseudo)
    }*/
    
    @SubscribeMessage('me blocks')
    async userBlock(client: Socket) {
        const user = await this.authService.getUserFromSocket(client);

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
            let  na : string;
            for (let i : number = 0; block.myblocked.length !== i; ++i) {
                re.push(block.myblocked[i].pseudo);
                // console.log("AAAAAAAAAAAAAAAAAAAAAAAAsss")
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
        // console.log("10000")

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
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
            return;
        if (chan.password) {
            const hash : string = await bcrypt.hash(chan.password, 3);
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
                delete channel.hash
                if (!chan.private) {
                this.wss.except(client.id).emit("new channel pub");
                this.listChannels(client);
                }
                else
                {
                    this.listChannels(client);
                }
                this.wss.to(client.id).emit("hihbib");
            }
                this.wss.to(client.id).emit("ygybyb");
            return
        }
        const channel = await this.Prisma.channel.create({
            data: {
                name: chan.name,
                private: chan.private,
                createurID: user.id,
                admin: { 
                    connect: [{
                        id: user.id
                    }]
                },
                users: {
                    connect: [{
                        id: user.id
                    }]
                },
            },
        })
        if (channel)
        {
            if (!chan.private) {
                // client.excpet(client.id).emit("new channel pub", chan.name);
                client.join(channel.name)
                 this.wss.except(client.id).emit("new channel pub", {id : channel.id, name: channel.name, private: false, admin: false, password: false});
                 this.wss.to(client.id).emit("my new channel pub", {id : channel.id, name: channel.name, private: false, admin: true, password: false});
                 this.listChannels(client);
                 //this.wss.to(client.id).emit("my new channel pub", chan.name);
                 }
        }
    }

    //game action
    InvitationGame(hostId :number, inviteId: number)
    {
        const socketIds = this.getAllSocketID(inviteId);
        socketIds.forEach(sock => {
            this.wss.to(sock).emit("New Invitation Game", hostId)
        });
    }

    cancelInvitationGame(hostId :number, inviteId: number)
    {
        const socketIds = this.getAllSocketID(inviteId);
        socketIds.forEach(sock => {
            this.wss.to(sock).emit("Cancel Invitation Game", hostId)
        });

    }

    @SubscribeMessage('Get Game Invitation')
    getGameInvitation(client: Socket) : number[]
    {
        const id = this.mapIdSocket.get(client.id);
        return this.getAllInvitationGame(id);
    }

    @SubscribeMessage('Get Players')
    getPlayingUserID() : number[]
    {
      return [...this.gameGateway.getPlayingUser()];
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

    //friend action

    @SubscribeMessage('dem friend')
    async demFriend(client: Socket, id :  number )
    {
        // console.log("demande amie", id)
        const user = await this.authService.getUserFromSocket(client);
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
        })

        // console.log("demande amie 2", user, users_2);
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
            // console.log("reussi")
           this.wss.to(client.id).emit("request_friend", users_2.id);
            this.wss.to(this.iddd[users_2.id]).emit("request_friend",  client.id);
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
        // console.log(user);
        // console.log(users_2);
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
        this.wss.to(client.id).emit("request_friend",);
        this.wss.to(this.iddd[users_2.id]).emit("request_friend", client.id);
       //     // console.log(users)
    }

    @SubscribeMessage('accept friend')
    async acceptFriend(client: Socket, id : number)
    {
        // console.log("$$receive", id)
        const user = await this.authService.getUserFromSocket(client)
        // console.log("$$user", user)
        const users_2 = await this.Prisma.user.findFirst({
            where: {
                id: id,
                friendReqSend: {
                    some: {
                        id :  user.id,
                    }
                },
            },
        });

        // console.log("$$user2", )
        if (users_2 == null)
            return null;
        const users = await this.Prisma.user.update({
            where: { 
                id: +id
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
        })
        if (users == null)
            return null;
        await this.Prisma.user.update({
            where: { 
                id: user.id 
            },
            data: {
                friendBy: {
                    connect: [{
                        id: +id
                    }]
                },
            },
        });
        this.wss.to(client.id).emit("request_friend", users_2.id);
        this.wss.to(this.iddd[users_2.id]).emit("request_friend", client.id); 
    }

    @SubscribeMessage('refuse friend')
    async refuseFriend(client: Socket, id : number)
    {
        const user = await this.authService.getUserFromSocket(client)
        const users_2 = await this.Prisma.user.findFirst({
            where: {
                id: id,
                friendReqSend: {
                    some: {
                        id :  user.id,
                    }
                },
            },
        });
        if (users_2 == null)
            return null;
        const users = await this.Prisma.user.update({
            where: { 
                id: id 
            },
            data: {
                friendReqSend: {
                    disconnect: [{
                        id: user.id
                    }]
                }
            },
        });
        this.wss.to(client.id).emit("request_friend", users_2.id);
        this.wss.to(this.iddd[users_2.id]).emit("request_friend", client.id);
    }

    @SubscribeMessage('sup friend')
    async supFriend(client: Socket, id : number)
    {
        const user = await this.authService.getUserFromSocket(client);
        // console.log("AAA");
        const user2 = await this.Prisma.user.findFirst({
            where: { 
                id: id,
                friendBy: {
                    some: {
                        id: +user.id
                    }
                },
            }
        });
        if (user2 == null)
            return null;
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
        this.wss.to(client.id).emit("request_friend", user2.id);
        this.wss.to(this.iddd[user2.id]).emit("request_friend", client.id);
    }
}
