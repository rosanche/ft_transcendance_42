import { Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common"
import { ChannelService } from "./channel.service"
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { Jwt2FAGuard } from '../auth/guard';
import { ChannelDto, InviteDto } from "../dto";
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from "rxjs";
import path = require('path');
import {join} from 'path';
import process = require('process');
import { Express } from 'express'

@UseGuards(Jwt2FAGuard)
@Controller('channel')
export class ChannelController
{
    constructor(private  ChannelService: ChannelService){}

    @Post('creat')
    create(@GetUser() user: User, @Body() dto: ChannelDto)
    { 
        return this.ChannelService.createchannel(user, dto);
    }

    @Get('mychanels')
    mychanels(@GetUser() user: User)
    {
        return this.ChannelService.mychannels(user);
    }

    @Get('list')
    listchannel(@GetUser() user: User)
    {
        return this.ChannelService.listchannels(user);
    }

    @Get(':id/users')
    listchannelusers(@Param('id') id , @GetUser() user: User)
    {
      
            return this.ChannelService.listchannelusers(user, +id);
    }

    @Post('join')
    joinchannel(@GetUser() user: User, @Body() dto: ChannelDto)
    {
        return this.ChannelService.joinchannel(user, dto);
    }

    @Post('quit')
    quitchannel(@GetUser() user: User, @Body() dto: ChannelDto)
    {
        return this.ChannelService.quitchannel(user, dto)
    }
    
    @Post('invite')
    invitechannel(@GetUser() user: User, @Body() dto: InviteDto)
    {
        return this.ChannelService.invitechannel(user, dto);
    }

    @Post('Blocked')
    blockedchannel(@GetUser() user: User, @Body() dto: InviteDto)
    {
        return this.ChannelService.blockedchannel(user, dto);

    }

   /* @Post('Mute')
    mutechannel(@GetUser() user: User, @Body() dto: InviteDto)
    {

    }*/
}