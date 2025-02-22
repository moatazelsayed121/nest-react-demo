import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { RegisterDto, LoginDto } from './dto';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth-guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../database/schemas/user.schema';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let mockResponse: Partial<Response>;

  const mockAuthService = {
    signUp: jest.fn().mockImplementation((dto: RegisterDto) => {
      return { access_token: 'fake-token' };
    }),
    signIn: jest.fn().mockImplementation((dto: LoginDto) => {
      return { access_token: 'fake-token' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthGuard,
        JwtService,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a user', async () => {
      const dto: RegisterDto = {
        name: 'moataz',
        email: 'test@example.com',
        password: 'Mm_123456',
      };
      await controller.signUp(dto, mockResponse as Response);
      expect(service.signUp).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth_token',
        'fake-token',
        {},
      );
    });
  });

  describe('signIn', () => {
    it('should sign in user', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: '123456' };
      await controller.signIn(dto, mockResponse as Response);
      expect(service.signIn).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth_token',
        'fake-token',
        {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
        },
      );
    });
  });

  describe('logout', () => {
    it('should sign out user', async () => {
      await controller.logout(mockResponse as Response);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth_token', {
        path: '/',
      });
    });
  });
});
