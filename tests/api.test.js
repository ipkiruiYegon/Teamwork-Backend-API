import request from 'supertest';
import { expect } from 'chai';
import server from '../src/index';

describe('unmatched routes', () => {
  it('GET /v1/auth returns status of 404 not found and an array containing the error', async () => {
    const response = await request(server).get('/v1');
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('status', 'error');
    expect(response.body).to.have.property('error');
    expect(response.body).to.be.a('object');
  });
});

describe('Create user account', () => {
  it('POST /api/v1/auth/create-user returns success and data object of the user created', async () => {
    const response = await request(server).post('/api/v1/auth/create-user');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'User account successfully created'
    );
    expect(response.body.data).to.have.property('token');
    expect(response.body.data).to.have.property('userId');
  });
});

describe('Login in to user account', () => {
  it('POST /api/v1/auth/signin returns success and data object of user logged in', async () => {
    const response = await request(server).post('/api/v1/auth/signin');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('userId');
  });
});

describe('Create a gif', () => {
  it('POST /api/v1/gif returns success and data object of user logged in', async () => {
    const response = await request(server).post('/api/v1/gifs');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'GIF image successfully posted'
    );
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('title');
    expect(response.body.data).to.have.property('imageUrl');
  });
});

describe('Create an article', () => {
  it('POST /api/v1/articles returns success and data object of user logged in', async () => {
    const response = await request(server).post('/api/v1/articles');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'Article successfully posted'
    );
    expect(response.body.data).to.have.property('articleId');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('title');
  });
});

describe('Edit an article', () => {
  it('PATCH /api/v1/articles/<:articleId> returns success and data object of user logged in', async () => {
    const response = await request(server).patch(
      '/api/v1/articles/<:articleId>'
    );
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'Article successfully updated'
    );
    expect(response.body.data).to.have.property('title');
    expect(response.body.data).to.have.property('article');
  });
});

describe('Employees can delete their articles', () => {
  it('DELETE /api/v1/articles/<:articleId> returns success and data object of user logged in', async () => {
    const response = await request(server).delete(
      '/api/v1/articles/<:articleId>'
    );
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'Article successfully deleted'
    );
  });
});

describe('Employees can delete their gifs', () => {
  it('DELETE /api/v1/articles/<:gifId> returns success and data object of user logged in', async () => {
    const response = await request(server).delete('/api/v1/articles/<:gifId>');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'gif post successfully deleted'
    );
  });
});

describe("Employees can comment on other colleagues' article post", () => {
  it('POST /api/v1/articles/<:articleId>/comment returns success and data object of user logged in', async () => {
    const response = await request(server).post(
      '/api/v1/articles/<:articleId>/comment'
    );
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'comment successfully created'
    );
    expect(response.body.data).to.have.property('articleTitle');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('article');
    expect(response.body.data).to.have.property('comment');
  });
});

describe("Employees can comment on other colleagues' gif post", () => {
  it('POST /api/v1/articles/<:gifId>/comment returns success and data object of user logged in', async () => {
    const response = await request(server).post(
      '/api/v1/articles/<:gifId>/comment'
    );
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'comment successfully created'
    );
    expect(response.body.data).to.have.property('articleTitle');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('article');
    expect(response.body.data).to.have.property('comment');
  });
});

describe('Employees can view all articles or gifs, showing the most recently posted articles or gifs first', () => {
  it('GET /api/v1/feed returns success and data object of user logged in', async () => {
    const response = await request(server).get('/api/v1/feed');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'comment successfully created'
    );
    expect(response.body.data).to.have.property('id');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('article/url');
    expect(response.body.data).to.have.property('title');
    expect(response.body.data).to.have.property('authorId');
  });
});

describe('Employees can view a specific article', () => {
  it('GET /api/v1/articles/<:articleId> returns success and data object of user logged in', async () => {
    const response = await request(server).get('/api/v1/articles/<:articleId>');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'comment successfully created'
    );
    expect(response.body.data).to.have.property('id');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('title');
    expect(response.body.data).to.have.property('article');
    expect(response.body.data).to.have.property('comments');
  });
});

describe('Employees can view a specific gif post', () => {
  it('GET /api/v1/gifs/<:gifId> returns success and data object of user logged in', async () => {
    const response = await request(server).get('/api/v1/gifs/<:gifId>');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property(
      'message',
      'comment successfully created'
    );
    expect(response.body.data).to.have.property('id');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('title');
    expect(response.body.data).to.have.property('article');
    expect(response.body.data).to.have.property('comments');
  });
});
