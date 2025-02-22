import { config } from 'dotenv';
config();
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import * as cookieParser from 'cookie-parser';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MongooseModule.forRoot(mongoUri)], // Import the full module
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe()); // Enable validation
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('Sign Up', () => {
    it('should return 400 for empty name', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: '',
          email: 'validemail@mail.com',
          password: 'Password_123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'name must be longer than or equal to 3 characters',
      );
    });

    it('should return 400 for empty email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'moataz', email: '', password: 'Password_123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'invalid-email', password: 'Password_123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'moataz',
          email: 'validemail@mail.com',
          password: 'pass12',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('password is not strong enough');
    });

    it('should return 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'moataz',
          email: 'validemail@mail.com',
          password: 'Password_123',
        });
      expect(response.status).toBe(200);
    });
  });

  describe('Sign In', () => {
    it('should return 400 for empty mail', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: '',
          password: 'Password_123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid-email', password: 'Password_123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for empty password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'validemail@mail.com',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('password should not be empty');
    });

    it('should return 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'validemail@mail.com',
          password: 'Password_123',
        });

      expect(response.status).toBe(200);
    });

    it('should return 404 when wrong credentials provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'notfoundemail@mail.com',
          password: 'Password_123',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Not Found');
    });
  });

  describe('Profile', () => {
    it('should return 200', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'validemail@mail.com',
          password: 'Password_123',
        });
      expect(loginResponse.headers['set-cookie']).toBeDefined(); // Ensure the cookie is set
      const cookie = loginResponse.headers['set-cookie'][0].split(';')[0];

      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Cookie', cookie);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('validemail@mail.com');
      expect(response.body.name).toBe('moataz');
    });

    it('should return 401 without token cookie', async () => {
      const response = await request(app.getHttpServer()).get('/auth/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('Sign out', () => {
    it('should return 204', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'validemail@mail.com',
          password: 'Password_123',
        });
      expect(loginResponse.headers['set-cookie']).toBeDefined(); // Ensure the cookie is set
      const cookie = loginResponse.headers['set-cookie'][0].split(';')[0];

      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', cookie);
      expect(logoutResponse.headers['set-cookie']).toBeDefined();
      expect(logoutResponse.status).toBe(204);
      expect(logoutResponse.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/auth_token=;/), // Cookie should be set to empty
        ]),
      );
    });
  });
});
