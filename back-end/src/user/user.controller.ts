import { Query ,Controller , Get, Param , Req, UseGuards } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';



@Controller('user')
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
}
