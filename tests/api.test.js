import request from 'supertest';
import { expect } from 'chai';
import fs from 'fs';
import server from '../src/index';

// const debug = require('debug')('teamwork-backend-api:debug');

const adminCredentials = {
  email: 'ipkiruig83@gmail.com',
  password: 'apisuperuser1'
};

const userCredentials = {
  email: 'gyegon@patnassacco.co.ke',
  password: 'apisuperuser1'
};
const login = async data => {
  const resToken = await request(server)
    .post('/api/v1/auth/signin')
    .send(data);
  const { token } = resToken.body.data;
  return token;
};

describe('All unmatched routes', () => {
  describe('/GET', () => {
    it('it should return status of 404 and error', async () => {
      const response = await request(server).get('/v1/auth');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
      expect(response.body).to.be.a('object');
    });
  });
  describe('/POST', () => {
    it('it should return status of 404 and error', async () => {
      const response = await request(server).post('/v1/auth');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
      expect(response.body).to.be.a('object');
    });
  });
  describe('/PUT', () => {
    it('it should return status of 404 and error', async () => {
      const response = await request(server).put('/v1/auth');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
      expect(response.body).to.be.a('object');
    });
  });
  describe('/PATCH', () => {
    it('it should return status of 404 and error', async () => {
      const response = await request(server).patch('/v1/auth');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
      expect(response.body).to.be.a('object');
    });
  });
  describe('/DELETE', () => {
    it('it should return status of 404 and error', async () => {
      const response = await request(server).delete('/v1/auth');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
      expect(response.body).to.be.a('object');
    });
  });
});

describe('Login in to user account', () => {
  describe('POST /api/v1/auth/signin', () => {
    it('it should return success and data object containing a token and userid When correct credentials are supplied', async () => {
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

    it('it should return error and error message when wrong or incomplete credentials are supplied', async () => {
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
      expect(response.body).to.have.property('error');
    });
  });
});

describe('Create user account', () => {
  describe('POST /api/v1/auth/create-user', () => {
    it('it should return success and data object of the user created when a valid post request is made- With Admin rights and a valid token', async () => {
      const userData = {
        firstName: 'Yegonic',
        lastName: 'Kipkirui Geoffrey',
        email: 'info@patnassacco.co.ke',
        phone: '0775395251',
        gender: 'Male',
        jobRole: 'Admin',
        department: 'Bosa',
        address: 'P.o box 52-20204',
        is_superuser: 'false',
        userId: 1
      };
      const adminToken = await login(adminCredentials);
      const response = await request(server)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${adminToken}`)
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

    it('it should return error and error message when a valid post request is made- Without Admin rights', async () => {
      const userData = {
        firstName: 'Yegon',
        lastName: 'Kipkirui Geoffrey',
        email: 'yegon@patnassacco.co.ke',
        password: 'dgcaljos0207',
        gender: 'Male',
        jobRole: 'Admin',
        department: 'Bosa',
        address: 'P.o box 52-20204',
        is_superuser: 'false',
        userId: 1
      };
      const userToken = await login(userCredentials);
      const response = await request(server)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${userToken}`)
        .send(userData);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'error');
    });

    it('it should return error and error message when the post request is made with incorrect or incomplete user data', async () => {
      const userData = {
        firstName: 'Yegon',
        lastName: 'Kipkirui Geoffrey',
        email: 'gyegonpatnassacco.co.ke',
        password: 'Admin0207',
        gender: 'Male',
        jobRole: 'Admin',
        department: 'Bosa',
        address: 'P.o box 52-20204',
        is_superuser: 'True',
        userId: 1
      };
      const adminToken = await login(adminCredentials);
      const response = await request(server)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);
      expect(response.status).to.equal(401);
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });
  });
});

describe('Create a gif', () => {
  describe('POST /api/v1/gifs', () => {
    it('it should return success and data object of gif posted', async () => {
      const token = await login(adminCredentials);
      const response = await request(server)
        .post('/api/v1/gifs')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${token}`)
        .field('category', 'motivation')
        .field('text', 'motivation')
        .field('userId', 1)
        .attach(
          'gif',
          fs.readFileSync(
            'C:/Users/Stallion Stud/Desktop/received_1475019652647734.gif'
          ),
          'christmas.gif'
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

    it('it should return error and error message when trying to post a gif with wrong data', async () => {
      const token = await login(adminCredentials);
      const response = await request(server)
        .post('/api/v1/gifs')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${token}`)
        .field('category', 'motivation')
        .field('text', 'motivation')
        .attach(
          'gif',
          fs.readFileSync('C:/Users/Stallion Stud/Desktop/photo0085.jpg'),
          'photo0085.jpg'
        );
      expect(response.status).to.equal(400 || 500);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });
  });
});

describe('Create an article', () => {
  describe('POST /api/v1/articles', () => {
    it('it should return success and article created when all details are correct', async () => {
      const token = await login(adminCredentials);
      const article = {
        category: 'Love',
        title: 'Agape',
        article: 'This is the unconditional love that God has for his children',
        userId: 1
      };
      const response = await request(server)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${token}`)
        .send(article);
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

    it('it should return error and error message when parameters are not correct or incomplete', async () => {
      const token = await login(adminCredentials);
      const article = {
        Title: 'Agape',
        article: 'This is the unconditional love that God has for his children'
      };
      const response = await request(server)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${token}`)
        .send(article);
      expect(response.status).to.equal(400 || 401 || 500);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });
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
  describe('DELETE /api/v1/gifs/:gifId', () => {
    it('it should return status success', async () => {
      const token = await login(adminCredentials);
      const response = await request(server)
        .delete('/api/v1/gifs/1')
        .set('Authorization', `Bearer ${token}`);
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
  describe('GET /api/v1/feed', () => {
    it('it should return success and array of gifs or article', async () => {
      const token = await login(userCredentials);
      const response = await request(server)
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('data');
    });
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
  describe('GET /api/v1/gifs/:gifId', () => {
    it('it should returns success and success and array of gifs and all the comments if any', async () => {
      const token = await login(userCredentials);
      const gifTest = await request(server)
        .post('/api/v1/gifs')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${token}`)
        .field('category', 'motivation')
        .field('text', 'motivation')
        .field('userId', 2)
        .attach(
          'gif',
          fs.readFileSync(
            'C:/Users/Stallion Stud/Desktop/received_1475019652647734.gif'
          ),
          'christmas.gif'
        );
      const response = await request(server)
        .get('/api/v1/gifs/2')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.data).to.have.property('comments');
    });
  });
});
