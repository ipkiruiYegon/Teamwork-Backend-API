import request from 'supertest';
import { expect } from 'chai';
import fs from 'fs';
import server from '../src/index';

const adminCredentials = {
  email: 'ipkiruig83@gmail.com',
  password: 'apisuperuser1'
};

const userCredentials = {
  email: 'gyegon@patnassacco.co.ke',
  password: 'apisuperuser1'
};

describe('unmatched routes', () => {
  it('GET /v1/auth it should return status of 404 and an array containing error', async () => {
    const response = await request(server).get('/v1/auth');
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('status', 'error');
    expect(response.body).to.have.property('error');
    expect(response.body).to.be.a('object');
  });
});

describe('Login in to user account', () => {
  it('POST /api/v1/auth/signin With correct credentials it should return success and data object containing a token and userid', async () => {
    const loginDetails = {
      email: 'ipkiruig83@gmail.com',
      password: 'apisuperuser1'
    };
    const response = await request(server)
      .post('/api/v1/auth/signin')
      .send(loginDetails);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('data');
    expect(response.body)
      .to.have.property('data')
      .to.be.a('object');
    expect(response.body).to.be.a('object');
    expect(response.body.data).to.have.property('token');
    expect(response.body.data).to.have.property('userId');
  });
  it('POST /api/v1/auth/signin with incorrect credentilas it should return error and error message', async () => {
    const loginDetails = {
      email: 'yegon@patnassacco.co.ke',
      password: 'Amin0207'
    };
    const response = await request(server)
      .post('/api/v1/auth/signin')
      .send(loginDetails);
    expect(response.status).to.equal(401);
    expect(response.body).to.be.a('object');
    expect(response.body).to.have.property('status', 'error');
    expect(response.body).to.have.property(
      'error',
      'invalid login credentials'
    );
  });
});

describe('Create user account', () => {
  it('POST /api/v1/auth/create-user without a valid token it should return status error Token is not provided', async () => {
    const userData = {
      firstName: 'Yegon',
      lastName: 'Kipkirui Geoffrey',
      email: 'gyegon@patnassacco.co.ke',
      password: 'dgcaljos0207',
      gender: 'Male',
      jobRole: 'Admin',
      department: 'Bosa',
      address: 'P.o box 52-20204',
      is_superuser: 'false'
    };
    const response = await request(server)
      .post('/api/v1/auth/create-user')
      .send(userData);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('status', 'error');
    expect(response.body).to.have.property('error', 'Token is not provided');
  });

  it('POST /api/v1/auth/create-user With Admin rights and a valid token it should return success and data object of the user created', async () => {
    const userData = {
      firstName: 'Yegon',
      lastName: 'Kipkirui Geoffrey',
      email: 'yegon@patnassacco.co.ke',
      password: 'dgcaljos0207',
      gender: 'Male',
      jobRole: 'Admin',
      department: 'Bosa',
      address: 'P.o box 52-20204',
      is_superuser: 'false'
    };
    const response = await request(server)
      .post('/api/v1/auth/create-user')
      .send(userData);
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

  it('POST /api/v1/auth/create-user with incorrect user date it should return error and error message', async () => {
    const userData = {
      firstName: 'Yegon',
      lastName: 'Kipkirui Geoffrey',
      email: 'gyegonpatnassacco.co.ke',
      password: 'Admin0207',
      gender: 'Male',
      jobRole: 'Admin',
      department: 'Bosa',
      address: 'P.o box 52-20204',
      is_superuser: 'True'
    };
    const response = await request(server)
      .post('/api/v1/auth/create-user')
      .send(userData);
    expect(response.status).to.equal(400);
    expect(response.body).to.be.a('object');
    expect(response.body).to.have.property('status', 'error');
    expect(response.body).to.have.property('error');
  });
});

describe('Create a gif', () => {
  it('POST /api/v1/gif it should return success and data object of gif posted', async () => {
    const response = await request(server)
      .post('/api/v1/gifs')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('image', 'png')
      .field('title', 'motivation')
      .attach(
        'gif',
        fs.readFileSync('C:/Users/Stallion Stud/Desktop/photo0085.jpg'),
        'yegon.jpg'
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
      'GIF image successfully posted'
    );
    expect(response.body.data).to.have.property('gifId');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('title');
    expect(response.body.data).to.have.property('imageUrl');
  });
});

describe('Create an article', () => {
  it('POST /api/v1/articles it should return success and article created', async () => {
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
  it('PATCH /api/v1/articles/:articleId it should return article updated', async () => {
    const response = await request(server).patch('/api/v1/articles/:articleId');
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
  it('DELETE /api/v1/articles/:articleId it should return', async () => {
    const response = await request(server).delete(
      '/api/v1/articles/:articleId'
    );
    expect(response.status).to.equal(200);
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
  it('DELETE /api/v1/articles/:gifId it should return success', async () => {
    const response = await request(server).delete('/api/v1/articles/:gifId');
    expect(response.status).to.equal(200);
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
  it('POST /api/v1/articles/:articleId/ it should return success', async () => {
    const response = await request(server).post(
      '/api/v1/articles/:articleId/comment'
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
  it('POST /api/v1/articles/:gifId/comment it should return success', async () => {
    const response = await request(server).post(
      '/api/v1/articles/:gifId/comment'
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
    expect(response.body.data).to.have.property('gifTitle');
    expect(response.body.data).to.have.property('createdOn');
    expect(response.body.data).to.have.property('comment');
  });
});

describe('Employees can view all articles or gifs, showing the most recently posted articles or gifs first', () => {
  it('GET /api/v1/feed it should return success and array of gifs or article', async () => {
    const response = await request(server).get('/api/v1/feed');
    expect(response.status).to.equal(200);
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
  it('GET /api/v1/articles/<:articleId> it should return success and array of article and its comments if any', async () => {
    const response = await request(server).get('/api/v1/articles/:articleId');
    expect(response.status).to.equal(200);
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
  it('GET /api/v1/gifs/<:gifId> it should returns success and success and array of gifs and its comments if any', async () => {
    const response = await request(server).get('/api/v1/gifs/:gifId');
    expect(response.status).to.equal(200);
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
