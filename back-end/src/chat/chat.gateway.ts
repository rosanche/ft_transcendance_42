import {  Logger, Inject, forwardRef} from "@nestjs/common";
import {ConnectedSocket , SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from '../auth/guard';
import { User, Channel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from "../auth/auth.service";
import * as bcrypt from 'bcrypt';
import { GameGateway } from "src/game/game.gateway";

type chann  = {
    id : number,
    name : string,
    private : boolean,
    admin : boolean,
    owner : boolean,
    password: boolean,
};

type Form  = {
    channel : string,
    pseudo : string,
    texte : string,
};

type pass = {
    name : string
    password : string,
    private: boolean,
  };

  type ban = {
    mute_ban: string, 
    name  : string,
    pseudo: string,
    time : number,
    motif : string, 
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
        // console.log(cha);
      /*  for (let i :number = 0; cha[i]; i++) {
            const a = new Map<number, Boolean>()
          //  await this.banactive.set(cha[i].name, new Map<Number, Boolean>());
           // await this.muteactive.set(cha[i].name, new Map<Number, Boolean>());
            for (let n :number = 0; cha[i].users[n]; n++) {
             //   await this.banactive.get(cha[i].name).set(cha[i].users[n].id, false)
               // console.log(this.banactive.get(cha[i].name).get(cha[i].users[n].id));
                t//his.ban_or_not(cha[i].name, cha[i].users[n].id)
            }
            console.log(`${cha[i].name} ha oui d'accord c'est toi`);
        }*/
    }

    async  handleDisconnect(client: Socket) {
        this.logger.log(`Method not implmented. ${client.id}`);
        const user = await this.authService.getUserFromSocket(client);
        if (user)
            this.iddd.delete(user.id);
    }

    async handleConnection( client: Socket, ... args: any[]) {
        const user = await this.authService.getUserFromSocket(client);
        console.log(`connection: ${user}`);
        if (user) {
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
            this.iddd[user.id] = client.id;
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
    @SubscribeMessage('joindm')
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
     }

    
    @SubscribeMessage('mpToServer')
    async handleMessageMp(client: Socket, message: { sender: string, pseudo: String, message: string }) {
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
    }

    @SubscribeMessage('pubchannels')
    async pubchannels(client: Socket, channel : string) {
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
                var re = new Array<chann>();
                var re = new Array<chann>();
                console.log("AAAAAAAAAAAoui")
            let  na : chann;
            for (let i : number = 0; channels[i]; ++i) {
                    na = {id: channels[i].id, name: channels[i].name, private: channels[i].private, admin: (false), owner : (false),password: (channels[i].hash !== null) }
                console.log(` oui enfin c'est toi oupa  ${user.id} et ${na.admin}`);
                re.push(na);
            }
            this.wss.to(this.iddd[user.id]).emit('channels pub', re);
            }
    }

    @SubscribeMessage('listchannels')
    async listChannels(client: Socket, channel : string)
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
            var re = new Array<chann>();
            let  na : chann;
            for (let i : number = 0; channels[i]; ++i) {
                console.log(channels[i].admin);
            if (channels[i].admin.length !== 0)
            na = {id: channels[i].id, name: channels[i].name, private: channels[i].private, admin: (true), owner: (channels[i].createurID === user.id)  ,password: (channels[i].hash !== null)}
            else
            na = {id: channels[i].id, name: channels[i].name, private: channels[i].private, admin: (false), owner: (false) ,password: (channels[i].hash !== null)}

                const a : string = na.name;
                console.log(` oui enfin c'est toi  ${user.id} et ${na.admin}`);
                client.join(channels[i].name);

                re.push(na);
            }
         //   console.log(`aouit ${channels[0].name}`);
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
        var re = new Array<Form>();
        let  na : Form;
        for (let i : number = 0; cha.length != i; ++i) {
                for (let n : number = 0; cha[i].post.length != n; ++n) {
                    na = {channel: cha[i].name, pseudo: cha[i].post[n].createur.pseudo, texte: cha[i].post[n].message}
                    re.push(na);
                }
            }
            
           console.log(re)
            this.wss.to(this.iddd[user.id]).emit('info channel', re); 
            
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
               name: chat.name,
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
           console.log('renvoie');
           const a : chann =  await {id: channel.id, name: channel.name, private: channel.private , owner: false,admin: (false), password: true}
           console.log(this.iddd[user.id]);
           this.wss.to(this.iddd[user.id]).emit('join channel true', a);
       }
       else
       {
           console.log('je suis une porte');
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
           console.log('renvoie');
           const a : chann =  await {id: channel.id, name: channel.name, private: channel.private , admin: (false), owner: false, password: false}
           console.log(this.iddd[user.id]);
           this.wss.to(this.iddd[user.id]).emit('join channel true', a);
       }
       else
       {
           this.wss.to(this.iddd[user.id]).emit('join channel false', room);
       }
       return ; 
   }

    @SubscribeMessage('quit')
    async handleRoomLeave(client: Socket, room: chann) {
        const user = await this.authService.getUserFromSocket(client);
        if (!user)
        {
            return;
        }
        console.log("oui");
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
            console.log(room)
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
            console.log(room)
            this.wss.to(client.id).emit('left chanel', room)   
            return;
        }
        this.wss.to(client.id).emit('owner no left', room);
    }

    @SubscribeMessage('channelToServer')
    async handleMessage(client: Socket, message: Form) {
        const user = await this.authService.getUserFromSocket(client);
        console.log(`bonjour le monde ${user.pseudo}`);
      //  this.wss.emit('chatToClient', {channel: message.channel, pseudo: user.pseudo, texte: message.texte }); 
        const ban = await this.Prisma.ban.findMany({
            where: {
                active: true,
                Channel: {
                    some: {
                        name: message.channel
                    }
                },
                id: user.id,
            }
        });
        const cha = await this.Prisma.channel.findFirst({
            where:{
                name : message.channel,
                users: {
                    some: {
                        id: user.id,
                    }
                }
            }
        })
        if (!cha)
            return null;
        if (true) {
            
            
           await this.Prisma.post.create({
                data: {
                    message: message.texte,
                    userID: user.id,
                    destByID: cha.id
                }
            });
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
            });
            console.log(`bonjour le monde ${user.pseudo} et ${message.channel}`);
            message.pseudo = user.pseudo;
            this.wss.to(message.channel).emit('chatToClient', message, block); 
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
                name: src.name, 
                users: {
                    some: {
                        pseudo : src.pseudo,
                    }
                },
                admin: {
                    some:{
                        id : user.id,
                    }
                }
            },
        });
        const user2 = await this.Prisma.user.findUnique({
            where:{
                pseudo : src.pseudo
            }
        })
        if (!user2)
        return;
        console.log("AAAkgogjAAA")
        if (cha) {
            if (src.mute_ban !== "ban" && src.mute_ban !== "mute")
                return;
            console.log("AAAA")
            const ban = await this.Prisma.ban.create({
                data:
                {
                    timeBan: +src.time,
                    finshBan: Date.now() + 60000 * +src.time,
                    muteBan: src.mute_ban,
                    active: true,
                    iduser: user2.id,
                }
            });  
          /*  if (src.mute_ban === "ban")
                this.wss.to(this.iddd[src.pseudo]).leave(src.name);*/
            console.log(src)
            this.wss.to(src.name).emit('you ban_mute', src);
            //this.wss.to(cha.name).emit('info ban_mute', src);
        }
    }
    
        // chef channel
    @SubscribeMessage('change owner')
    async newOwner(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where:{
                pseudo : src.pseudo
            }
        })
        console.log("AAAA");
        if (!user || !user2)
            return "";
        const cha = await this.Prisma.channel.findFirst({
            where: {
                name: src.name, 
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
            console.log(chas);
            //this.wss.to(client.id).emit('you ban_mute', src);
            //this.wss.to(cha.name).emit('info ban_mute', src);
        }
    }
    @SubscribeMessage('new admin')
    async newAdmin(client: Socket, src: ban) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where:{
                pseudo: src.pseudo,
            }
        });
        if (!user2)
            return null;
            const Channel =  await this.Prisma.channel.findFirst({
                where:{
                    AND: [{
                        name: src.name,
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
    @SubscribeMessage('blockedUser')
    async blockedUser(client: Socket, src: { pseudo: string, room: string, type: string,  time : Number, description : string}) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where: {
                pseudo: src.pseudo,
            }
        });
        if (user2 && user) {
            return await this.Prisma.user.update({
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
        }
        return null;
    }

    @SubscribeMessage('creatcha')
    async creatChan(client: Socket, chan : pass)
    {
        console.log(chan);
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
                delete channel.hash
                if (!chan.private) {
               // client.excpet(client.id).emit("new channel pub", chan.name);
                this.wss.except(client.id).emit("new channel pub", {id : channel.id, name: channel.name, private: false, admin: false, password: true});
                this.wss.to(client.id).emit("my new channel pub", {id : channel.id, name: channel.name, private: false, admin: true, password: true});
                }
            }
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
                 this.wss.except(client.id).emit("new channel pub", {id : channel.id, name: channel.name, private: false, admin: false, password: false});
                 this.wss.to(client.id).emit("my new channel pub", {id : channel.id, name: channel.name, private: false, admin: true, password: false});
                 //this.wss.to(client.id).emit("my new channel pub", chan.name);
                 }
        }
    }


}
