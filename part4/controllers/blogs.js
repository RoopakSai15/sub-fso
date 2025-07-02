const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get("/", async  (request, response, next) => {
  const result = await Blog.find({})
  
  response.json(result)
})

blogRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  }catch{
    next(error)
  }
})

blogRouter.delete("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  
  if (blog) {
    await Blog.findByIdAndRemove(request.params.id)
    response.send(204).end()
  }else{
    response.status(404).end()
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      {
      new: true, // returns updated blog instead of old one
      runValidators: true, // applies schema validation
      context: 'query' // required for some validators
    })
    response.json(updatedBlog)
  }else{
    response.status(404).send({ error: "blog not found"})
  }
})

module.exports = blogRouter