import { Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common"
import { ChannelService } from "./channel.service"
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChannelDto, InviteDto } from "../dto";
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from "rxjs";
import path = require('path');
import {join} from 'path';
import process = require('process');
import { Express } from 'express'

@Controller('channel')
export class ChannelController
{
    constructor(private  ChannelService: ChannelService){}

    @UseGuards(JwtGuard)
    @Post('creat')
    create(@GetUser() user: User, @Body() dto: ChannelDto)
    { 
        return this.ChannelService.createchannel(user, dto);
    }

    @UseGuards(JwtGuard)
    @Get('mychanels')
    mychanels(@GetUser() user: User)
    {
        return this.ChannelService.mychannels(user);
    }

    @UseGuards(JwtGuard)
    @Get('list')
    listchannel(@GetUser() user: User)
    {
        return this.ChannelService.listchannels(user);
    }

    @Post('join')
    joinchannel(@GetUser() user: User, @Body() dto: ChannelDto)
    {
        return this.ChannelService.joinchannel(user, dto);
    }

    @UseGuards(JwtGuard)
    @Post('quit')
    quitchannel(@GetUser() user: User, @Body() dto: ChannelDto)
    {
        return this.ChannelService.quitchannel(user, dto)
    }
    
    @UseGuards(JwtGuard)
    @Post('invite')
    invitechannel(@GetUser() user: User, @Body() dto: InviteDto)
    {
        return this.ChannelService.invitechannel(user, dto);
    }
    
}