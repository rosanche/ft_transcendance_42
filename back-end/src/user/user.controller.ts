import { Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, UploadedFile} from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserUpdateDto } from "../auth/dto";
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from "rxjs";
import path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimage',
  filename: (req, file, cb) => {
  const filename: string =  path.parse(file.originelname).name.replace(/\s/g,'') + uuidv4();
  const extension: string = path.parse(file.originelname).ext;
  cb(null,`${filename}${extension}`)
  }
})
}

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
  findid( @Param('id') id ) : any
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

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
      return user;
  }
  @UseGuards(JwtGuard)
  @Patch('me/modif')
  UserModif(@GetUser() user: User, @Body() dto: UserUpdateDto) {
      return this.UserService.UserModif(user, dto); 
  }

  @Post('55')
  @UseInterceptors(FileInterceptor('file', storage))
  uploaddpp(@UploadedFile() file): Observable<Object> {
      return of({imagePath: file.path}); 
  }

}
