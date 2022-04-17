const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  let result = 0;
  blogs.forEach((blog) => {
    result += blog.likes;
  });
  return result;
};

const mostLikes = (blogs) => {
  let top = 0;
  let topObject = {};
  blogs.forEach((blog) => {
    if (blog.likes > top) {
      top = blog.likes;
      topObject = blog;
      delete topObject._id;
      delete topObject.__v;
      delete topObject.url;
    }
  });
  return topObject;
};

const mostBlogs = (blogs) => {
  const result = _(blogs).countBy('author').entries().maxBy(_.last);
  return {
    author: result[0],
    blogs: result[1],
  };
};

const mostLikedAuthor = (blogs) => {
  const result = _(blogs)
    .groupBy('author')
    .map((blog, author) => ([author, _.sumBy(blog, 'likes')]))
    .maxBy(_.last);
  return {
    author: result[0],
    likes: result[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
  mostLikedAuthor,
};
