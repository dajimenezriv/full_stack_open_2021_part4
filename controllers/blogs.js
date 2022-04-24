const router = require('express').Router();
const Blog = require('../models/blog');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

router.post('/', async (request, response) => {
  const {
    title,
    author,
    url,
  } = request.body;
  let { likes } = request.body;

  if (!title || !url) return response.status(404).json({ error: 'title and url must be provided' });
  if (!likes) likes = 0;
  if (!request.user) return response.status(401).json({ error: 'token missing or invalid' });

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: request.user._id,
  });

  const res = await blog.save();
  return response.status(201).json(res);
});

// only the user that created the blog can delete it
router.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!request.user) return response.status(401).json({ error: 'token missing or invalid' });
  if (request.user._id.equals(blog.user)) {
    await blog.delete();
    return response.status(204).end();
  }
  return response.status(401).json({ error: 'unauthorized' });
});

router.put('/:id', async (request, response) => {
  const { body } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  return response.status(204).json(updatedBlog);
});

module.exports = router;
