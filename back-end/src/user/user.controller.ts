import { Query ,Controller, Put , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Jwt2FAGuard } from 'src/auth/guard';
import { UserUpdateDto, FriendDto } from "../auth/dto";
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from "rxjs";
import path = require('path');
import {join} from 'path';
import process = require('process');
import { Express } from 'express'
export const storage = {
  storage: diskStorage({
  destination: './uploads/profileimage',
  filename: (req, file, cb) => {
  const filename: string =  path.parse(file.originalname).name.replace(/\s/g,'') + uuidv4();
  const extension: string = path.parse(file.originalname).ext;
  cb(null,`${filename}${extension}`)
  }
})
}

@UseGuards(Jwt2FAGuard)
@Controller('users')
export class UserController
{
  constructor(private  UserService: UserService){}
  @Get('all')
  findAll() : Promise<any[]>
  {
    return this.UserService.findAll();
  }

  @Get('id/:id')
  findid(@Param('id') id ) : any
  {
    return this.UserService.findid(id);
  }

  @Get('email/:email')
  findemail( @Param('email') pseudo ) : any
  {
    return this.UserService.findemail(pseudo);
  }

  @Get('pseudo/:pseudo')
  findpseudo( @Param('pseudo') pseudo ) : any
  {
    return this.UserService.findpseudo(pseudo);
  }


  @Get('me')
  getMe(@GetUser() user: User) {
      return this.UserService.myInfo(user);
  }

  @Patch('me/modif')
  UserModif(@GetUser() user: User, @Body() dto: UserUpdateDto) {
      return this.UserService.UserModif(user, dto); 
  }

  @Put('me/uploadPP')
  @UseInterceptors(FileInterceptor('file', storage))
  uploaddpp(@GetUser() user: User, @UploadedFile() file, @Request() req: Express.Multer.File){
      console.log(file);
      console.log(file);
      console.log(this.UserService.UserUploadedImage(user, file.filename));
      return this.UserService.UserUploadedImage(user, file.filename);
  }

  @Get('me/pp/:image')
  findProfileImage(@Param('image') image, @Res() res) : Observable<object>
  {
    return of(res.sendFile(join(process.cwd(),'uploads/profileimage/'+image)))
  }
}
