const { test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert/strict')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./testHelper')
const blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
    const newBlog = helper.newBlog

    response = await api.post('/api/blogs').send(newBlog)

    const blogsAfter = await helper.blogsInDB();
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)

    const titles = blogsAfter.map(bloga => bloga.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('new blog post without any likes', async () => {
    const newBlog = helper.blogWNoLikes

    response = await api.post('/api/blogs').send(newBlog)
      .expect(201)
      .expect("Content-type", /application\/json/)

    assert.strictEqual(response.body.likes, 0)

  })

  test('new blog without title', async () => {
    const newBlog = helper.blogWNoTitle

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})



after(async () => {
  await mongoose.connection.close()
})