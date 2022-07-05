import { Test, TestingModule } from '@nestjs/testing';
import { Controller , Get } from "@nestjs/common"
import { UserService } from "./user.service"


@Controller('userinfo')
export class UserController
{
  constructor(private  UserService: UserService){}
  @Get()
  findAll() : Promise<any[]>
  {
    return this.UserService.findAll();
  }
}
