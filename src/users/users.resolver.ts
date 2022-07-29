import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { name: 'user' })
  findOneById(@Args('name', { type: () => String }) name: string) {
    return this.usersService.getByUser(name);
  }

  @Query(() => [User], { name: 'users' })
  getAll() {
    return this.usersService.getAll();
  }
}
