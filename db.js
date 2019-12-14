const config = require('config');

const bcrypt = require('bcrypt');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: config.get('database')
});

const createTables = () => {
  const teamWorkDb = `DROP TABLE IF EXISTS sys_users, articles, articles_flags, articles_comments, categories,gifs,gifs_flags,gif_comments,gif_comments,sys_logs CASCADE;
  CREATE TABLE IF NOT EXISTS
      sys_users(
        id SERIAL PRIMARY KEY,
        password VARCHAR NOT NULL,
        firstName VARCHAR(30) NOT NULL,
        lastName VARCHAR(130) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL UNIQUE,
        last_login VARCHAR(30),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
        password_status VARCHAR(10) NOT NULL,
        login_attempts VARCHAR(2),
        gender VARCHAR(6) NOT NULL,
        jobRole VARCHAR(30) NOT NULL,
        department VARCHAR(30) NOT NULL,
        address VARCHAR(150) NOT NULL,
        imageURL VARCHAR(150),
        created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
  CREATE TABLE IF NOT EXISTS
      articles(
        id SERIAL PRIMARY KEY,
        category VARCHAR(128) NOT NULL,
        title VARCHAR(150) NOT NULL,
        text VARCHAR NOT NULL,
        createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        article_flagged BOOLEAN NOT NULL DEFAULT FALSE,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      articles_flags(
        id SERIAL PRIMARY KEY,
        article SERIAL NOT NULL,
        reason VARCHAR NOT NULL,
        flag_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      articles_comments(
        id SERIAL PRIMARY KEY,
        article SERIAL NOT NULL,
        text VARCHAR NOT NULL,
        comment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        comment_flagged BOOLEAN NOT NULL DEFAULT FALSE,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      categories(
        id SERIAL PRIMARY KEY,
        type VARCHAR NOT NULL,
        text VARCHAR NOT NULL,
        available BOOLEAN NOT NULL DEFAULT TRUE,
        created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      gifs(
        id SERIAL PRIMARY KEY,
        category VARCHAR(128) NOT NULL,
        gifURL VARCHAR(150) NOT NULL,
        text VARCHAR NOT NULL,
        posted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        gif_flagged BOOLEAN NOT NULL DEFAULT FALSE,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      gifs_flags(
        id SERIAL PRIMARY KEY,
        gif SERIAL NOT NULL,
        reason VARCHAR NOT NULL,
        flag_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      gif_comments(
        id SERIAL PRIMARY KEY,
        gif SERIAL NOT NULL,
        text VARCHAR NOT NULL,
        comment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        comment_flagged BOOLEAN NOT NULL DEFAULT FALSE,
        user_id SERIAL NOT NULL
      );
  CREATE TABLE IF NOT EXISTS
      sys_logs(
        id SERIAL PRIMARY KEY,
        type VARCHAR NOT NULL,
        action VARCHAR NOT NULL,
        log_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id SERIAL NOT NULL
      )`;
  pool
    .query(teamWorkDb)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const alterTables = () => {
  const updateTables = `ALTER TABLE articles
    ADD CONSTRAINT articles_fkey FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    ALTER TABLE articles_flags
    ADD CONSTRAINT  articles_fkey1 FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE,
    ADD CONSTRAINT  articles_fkey2 FOREIGN KEY (article) REFERENCES articles(id) ON DELETE CASCADE;
    ALTER TABLE articles_comments
    ADD CONSTRAINT  articles_fkey3 FOREIGN KEY (article) REFERENCES articles(id) ON DELETE CASCADE,
    ADD CONSTRAINT  articles_fkey4 FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    ALTER TABLE categories
    ADD CONSTRAINT  categories_fkey FOREIGN KEY (user_id) REFERENCES sys_users(id);
    ALTER TABLE gifs
    ADD CONSTRAINT  gifs_fkey FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    ALTER TABLE gifs_flags
    ADD CONSTRAINT  gifs_fkey1 FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE,
    ADD CONSTRAINT  gifs_fkey2 FOREIGN KEY (gif) REFERENCES gifs(id) ON DELETE CASCADE;
    ALTER TABLE gif_comments
    ADD CONSTRAINT  gifs_fkey3 FOREIGN KEY (gif) REFERENCES gifs(id) ON DELETE CASCADE,
    ADD CONSTRAINT  gifs_fkey4 FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE;
    ALTER TABLE sys_logs
    ADD CONSTRAINT  sys_logs_fkey FOREIGN KEY (user_id) REFERENCES sys_users(id) ON DELETE CASCADE`;
  pool
    .query(updateTables)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createSuperUser = () => {
  const superUser = 'INSERT INTO sys_users(password, firstName, lastName, email, phone, is_superuser, password_status,login_attempts,gender,jobRole,department,address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12)';
  const hash = bcrypt.hashSync('apisuperuser1', 10);
  const values = [
    hash,
    'Yegon',
    'Kipkirui Geoffrey',
    'ipkiruig83@gmail.com',
    '0722395251',
    'true',
    'Change',
    0,
    'Male',
    'Administrator',
    'ICT',
    'P.o Box 52-20204'
  ];
  pool
    .query(superUser, values)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

//  export pool and createTables to be accessible  from anywhere within the application

module.exports = {
  createTables, alterTables, createSuperUser, pool
};

require('make-runnable');
