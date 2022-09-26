import { Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common"
import { FriendService } from "./friend.service"
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserUpdateDto, FriendDto } from "../auth/dto";
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from "rxjs";
import path = require('path');
import {join} from 'path';
import process = require('process');
import { Express } from 'express'


@Controller('friend')
export class FriendController
{
    constructor(private  FriendService: FriendService){}
    @UseGuards(JwtGuard)
    @Post('add')
    addfriend(@GetUser() user: User ,@Body() friend: FriendDto)
    {
      return this.FriendService.addFriend(user, friend);
    }
    @UseGuards(JwtGuard)
    @Post('dem')
    demfriend(@GetUser() user: User ,@Body() friend: FriendDto)
    {
      return this.FriendService.demfriend(user, friend);
    }
    @UseGuards(JwtGuard)
    @Get('list')
    listfriend(@GetUser() user: User)
    {
      return this.FriendService.listFriend(user);
    }
    @UseGuards(JwtGuard)
    @Post('ignor')
    ignoreFriend(@GetUser() user: User ,@Body() friend: FriendDto)
    {
      return this.FriendService.ignoreFriend(user, friend);
    }
    @UseGuards(JwtGuard)
    @Post('sup')
    supfriend(@GetUser() user: User ,@Body() friend: FriendDto)
    {
      return this.FriendService.supfriend(user, friend);
    }
}