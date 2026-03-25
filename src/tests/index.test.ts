import request from 'supertest';
import { server } from '../index';
import { ServerResponse } from 'http';

describe('API tests', () => {
  let testUserId = '';

  afterAll(() => {
    server.close();
  });

  test('get all records', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('create user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ username: 'Bascov', age: 27, hobbies: ['hobby horsing', 'art'] });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    testUserId = res.body.id;
  });

  test('find user', async () => {
    const res = await request(server).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testUserId);
  });

  test('update user', async () => {
    const res = await request(server)
      .put(`/api/users/${testUserId}`)
      .send({ username: 'Bascov', age: 33 });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testUserId);
    expect(res.body.age).toBe(33);
  });

  test('delete user', async () => {
    const res = await request(server).delete(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(204);
  });

  test('find deleted user', async () => {
    const res = await request(server).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(404);
  });
});
