import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/user.schema';
import { connect, Connection, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = (await connect(uri)).connection;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: connection.model(User.name, UserSchema),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    await model.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed',
    });

    const user = await service.findOne('test@example.com');
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
  });

  it('should return null if user is not found', async () => {
    const user = await service.findOne('notfound@example.com');
    expect(user).toBeNull();
  });
});
