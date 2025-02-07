import {
  Req,
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Put,
  Patch,
  Param,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { ResponseFilter } from '../../../common/interceptors/response.interceptor';
import { Request } from 'express';
import { UserModel } from '../entities/user';
import { UserInfoQuery } from '../queries/user-info/user-info.query';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { CreateUserCommand } from '../commands/create-user/create-user.command';
import { Role } from '../../../shared/enums/role.enum';
import { Roles } from '../../../common/decorators/role.decorator';
import { UpdateUserCommand } from '../commands/update-user/update-user.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileFromRequest } from '../../../shared/utilities/helpers';
import { UpdateUserImageCommand } from '../commands/update-user-image/update-user-image.command';
import { request } from 'axios';
import { UpdateUserPasswordCommand } from '../commands/update-user-password/update-user-password.command';
import { UserInfoResponse } from './models/user-info.response';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ResponseFilter)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    private configService: ConfigService,
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  public async me(@Req() request: Request): Promise<UserInfoResponse> {
    const currentUser =
      request[this.configService.get<string>('app.jwt.secret.name')];
    const query = new UserInfoQuery(currentUser.id);
    return await this.queryBus.execute(query);
  }

  @Post('/create-user')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(AuthGuard)
  public async createUser(
    @Body() user: UserModel,
    @Req() request: Request,
  ): Promise<UserModel> {
    const currentUser =
      request[this.configService.get<string>('app.jwt.secret.name')];
    const command = new CreateUserCommand(
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phoneNumber,
      user.identificationType,
      user.identificationNumber,
      user.roles,
      currentUser.id,
    );
    return await this.commandBus.execute(command);
  }

  @Put('/update-user')
  @UseGuards(AuthGuard)
  public async updateUser(@Body() user: UserModel, @Req() request: Request) {
    const currentUser =
      request[this.configService.get<string>('app.jwt.secret.name')];
    const command = new UpdateUserCommand(
      currentUser.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phoneNumber,
      user.identificationType,
      user.identificationNumber,
      user.roles,
      currentUser.id,
    );
    return await this.commandBus.execute(command);
  }

  @Patch('/update-user-image')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  public async updateUserImage(@Req() request: Request) {
    const currentUser =
      request[this.configService.get<string>('app.jwt.secret.name')];
    const file = getFileFromRequest(request);
    const command = new UpdateUserImageCommand(currentUser.id, file);
    return await this.commandBus.execute(command);
  }

  @Get('/by/email/:email')
  public async getUserByEmail(@Param('email') email: string) {
    const command = new UserInfoQuery(null, email);
    return await this.queryBus.execute(command);
  }

  @Patch('/update-password')
  @UseGuards(AuthGuard)
  public async updateUserPassword(
    @Body() user: UserModel,
    @Req() request: Request,
  ) {
    const currentUser =
      request[this.configService.get<string>('app.jwt.secret.name')];
    const command = new UpdateUserPasswordCommand(
      currentUser.id,
      user.password,
    );
    return await this.commandBus.execute(command);
  }
}
