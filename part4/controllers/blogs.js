const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get("/", async  (request, response, next) => {
  const result = await Blog
    .find({}).populate('user',{ name: 1, username: 1})
  
  response.json(result)
})

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body

    
    if (!body.title || !body.url){
      return response.status(400).json({error: 'title or url missing'})
    }

    const user = await User.findById(body.userId)

    if (!user) {
      response.status(400).json({error: 'userId missing or not valid'})
    }

    const blog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes || 0,
      user: user
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)
  await user.save()
    response.status(201).json(result)
  }catch{
    next(error)
  }
})

blogsRouter.delete("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  
  if (blog) {
    await Blog.findByIdAndRemove(request.params.id)
    response.send(204).end()
  }else{
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      {
      new: true, 
      runValidators: true, 
      context: 'query' 
    })
    response.json(updatedBlog)
  }else{
    response.status(404).send({ error: "blog not found"})
  }
})

module.exports = blogsRouter