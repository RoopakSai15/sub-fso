const { test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert/strict')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./testHelper')
const bcrypt = require('bcryptjs')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Test User', passwordHash })
  const savedUser = await user.save()

  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))

  await Blog.insertMany(blogsWithUser)
})

describe("GET Method check", () => {
  test('get /', async ()=> {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
  })

  test('id attribute', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(typeof blog.id, 'string')
    assert.strictEqual(blog._id, undefined)
  })
})

describe('creating a new blog', () => {
  test('new blog post',async () => {
    const blogsBefore = await helper.blogsInDB()
    const loggedUser = await api.post('/api/login').send(helper.loginUser) 
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlog)
    const newBlog = response.body
    const blogsAfter = await helper.blogsInDB();

    assert.strictEqual(blogsAfter.length, blogsBefore.length + 1)
    const titles = blogsAfter.map(bloga => bloga.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('new blog post without any likes', async () => {
    const blogsBefore = await helper.blogsInDB()
    const loggedUser = await api.post('/api/login').send(helper.loginUser) 
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(helper.blogWNoLikes)
      .expect(201)
      .expect("Content-type", /application\/json/)
    const blogsAfter = await helper.blogsInDB()

    assert.strictEqual(response.body.likes, 0)
    assert.strictEqual(blogsAfter.length, blogsBefore.length + 1)
  })

  test('new blog without title', async () => {
    const blogsBefore = await helper.blogsInDB()
    const newBlog = helper.blogWNoTitle
    const loggedUser = await api.post('/api/login').send(helper.loginUser) 
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(newBlog)
      .expect(400)
    const blogsAfter = await helper.blogsInDB()

    assert.strictEqual(blogsBefore.length, blogsAfter.length)
  })
})

describe('updating of a blog', () => {
  test('should update details of an existing blog successfully', async () => {
  // 1. Log in
  const loginResponse = await api.post('/api/login').send(helper.loginUser)
  const token = loginResponse.body.token

  // 2. Create a blog as that user
  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Original Title',
      author: 'Someone',
      url: 'http://example.com',
      likes: 5,
    })

  const blogToUpdate = createResponse.body

  // 3. Prepare the updated data
  const updatedBlogData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  // 4. Make the PUT request
  const updateResponse = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(200)

  // 5. Assert the result
  assert.strictEqual(updateResponse.body.likes, updatedBlogData.likes)
})
})

describe('deletion of a blog', () => {
  test('should succeed with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    const response = await api.post('/api/blogs').set('authorization', `Bearer ${loggedUser.body.token}`).send(helper.newBlog)
    const blogsAfterAddition = await helper.blogsInDB()

    await api.delete(`/api/blogs/${response.body.id}`).set('Authorization', `Bearer ${loggedUser.body.token}`).expect(204)
    const blogsAtEnd = await helper.blogsInDB()

    assert.strictEqual(blogsAfterAddition.length, blogsAtStart.length + 1)
    assert.strictEqual(blogsAtEnd.length, blogsAfterAddition.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})