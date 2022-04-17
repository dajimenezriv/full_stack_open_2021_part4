// npm test -- tests/blogs_supertest.test.js

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

let token;

// create all users and login with the first one
beforeAll(async () => {
  await User.deleteMany({});

  const promiseArray = helper.initialUsers
    .map((user) => api
      .post('/api/users')
      .send(user));

  await Promise.all(promiseArray);

  const { username, password } = helper.initialUsers[0];

  token = (await api
    .post('/api/login')
    .send({
      username,
      password,
    }))._body.token;
});

// create all blogs with the first user logged
beforeEach(async () => {
  await Blog.deleteMany({});

  const promiseArray = await helper.initialBlogs
    .map(async (blog) => api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog));

  await Promise.all(promiseArray);
});

describe('return blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    // api.get returns a response with a lot of methods, and body is among them
    const blogs = await api.get('/api/blogs');
    expect(blogs.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blog contains id attribute', async () => {
    const blog = (await helper.blogsInDb())[0];
    expect(blog.id).toBeDefined();
  });
});

describe('create blog', () => {
  test('create blog', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain('Type wars');
  });

  test('create blog without likes', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    };

    const blog = (await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)).body;

    expect(blog.likes).toBe(0);
  });

  test('create blog without title', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(404);
  });

  test('create blog without url', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(404);
  });

  test('create blog without token (401)', async () => {
    const newBlog = {
      title: 'Type wars',
      url: 'urldefault',
      author: 'Robert C. Martin',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });
});

describe('delete blog', () => {
  test('delete valid blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('delete already removed blog', async () => {
    const blogId = await helper.nonExistingBlogId();

    await api
      .delete(`/api/blogs/${blogId.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  });

  test('delete blog without token', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401);
  });
});

describe('update blog', () => {
  test('update sucessfully a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    let titles = blogsAtStart.map((blog) => blog.title);
    expect(titles).not.toContain('Change the title');

    blogToUpdate.title = 'Change the title';
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('Change the title');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
