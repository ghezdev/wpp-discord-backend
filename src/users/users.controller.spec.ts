import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserDTOStub } from './stubs/user.dto.stub';
import { UsersController } from './users.controller';
import { UsersService } from './Users.service';

// For information about database connection:
// https://betterprogramming.pub/testing-controllers-in-nestjs-and-mongo-with-jest-63e1b208503c
describe('UsersController', () => {
  let usersController: UsersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const Users: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    usersController = Users.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('post user', () => {
    it('should return the saved user', async () => {
      const createdUser = await usersController.createUser(UserDTOStub());
      expect(createdUser.name).toBe(UserDTOStub().name);
    });

    // it('should return ArticleAlreadyExists (Bad Request - 400) exception', async () => {
    //   await new userModel(UserDTOStub()).save();
    //   await expect(usersController.createUser(UserDTOStub())).rejects.toThrow(
    //     ArticleAlreadyExists,
    //   );
    // });
  });

  describe('get user', () => {
    it('should return user required', async () => {
      const createdUser = await usersController.createUser(UserDTOStub());
      createdUser.save();

      const gettedUser = await usersController.getByUser(UserDTOStub().name);
      expect(gettedUser.name).toBe(UserDTOStub().name);
    });
  });
});
