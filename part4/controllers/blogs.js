const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get("/", async  (request, response, next) => {
  const result = await Blog
    .find({}).populate('user',{ name: 1, username: 1})
  
  response.json(result)
})

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  try {
    const { user } = request

    if (!user){
      return response.status(401).json({ error: 'token invalid'})
    }
    const body = request.body
    
    if (!body.title || !body.url){
      return response.status(400).json({error: 'title or url missing'})
    }

    const blog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes || 0,
      user: user.id
    })

    const result = await blog.save()
    const savedBlog = await result.populate('user',{username: 1, name: 1})
    if (!user.blogs) user.blogs = []
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())

  }catch(error){
    next(error)
  }
})

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    const { user } = request
    const blog = await Blog.findById(request.params.id)

    if (!blog) return response.status(404).json({ error: 'blog not found' })
    if (blog.user.toString() !== user.id.toString())
      return response.status(401).json({ error: 'unauthorized access' })

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', userExtractor,async (request, response, next) => {
  try {
    const { user } = request
    const { title, author, url, likes } = request.body
    const blog = await Blog.findById(request.params.id)
  

    if (!blog) return response.status(404).json({ error: 'blog not found' })
    if (blog.user.toString() !== user.id.toString())
      return response.status(401).json({ error: 'unauthorized access' })
    
    const updatedFields = {}
    if (title !== undefined) updatedFields.title = title
    if (author !== undefined) updatedFields.author = author
    if (url !== undefined) updatedFields.url = url
    if (likes !== undefined) updatedFields.likes = likes

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
      updatedFields,
      {
      new: true, 
      runValidators: true, 
      context: 'query' 
    }).populate('user', { username: 1, name: 1})
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter