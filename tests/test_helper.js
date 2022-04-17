const Blog = require('../models/blog');
const User = require('../models/user');

const initialUsers = [
  {
    username: 'admin',
    name: 'admin',
    password: 'admin',
  },
  {
    username: 'normal',
    name: 'normal',
    password: 'normal',
  },
];

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
];

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const blogsInDb = async () => {
  // retrieves all blogs
  const blogs = await Blog.find({});
  // transform them to json (and parse _id and __v)
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialUsers,
  initialBlogs,
  usersInDb,
  blogsInDb,
  nonExistingBlogId,
};
