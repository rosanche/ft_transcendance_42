import { Query ,Controller , Get, Param , UseGuards, Patch, Body} from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AuthDto } from "../auth/dto";


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
  UserModif(@GetUser() user: User, @Body() dto: AuthDto) {
      return this.UserService.UserModif(user, dto); 
  }
}
