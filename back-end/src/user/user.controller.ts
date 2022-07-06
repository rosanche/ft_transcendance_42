import { Test, TestingModule } from '@nestjs/testing';
import { Query ,Controller , Get } from "@nestjs/common"
import { UserService } from "./user.service"


@Controller('userinfo')
export class UserController
{
  constructor(private  UserService: UserService){}
  @Get('all')
  findAll() : Promise<any[]>
  {
    return this.UserService.findAll();
  }
  @Get('id')
  findname(@Query() id: number) : any
  {
    return this.UserService.findname(1);
  }
}
