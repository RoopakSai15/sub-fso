const bcrypt = require('bcryptjs');
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const supertest = require('supertest')
const mongoose = require('mongoose');
const app = require('../app')
const api = supertest(app)
const helper = require('./testHelper')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash1 = await bcrypt.hash('secret', 10)
    const passwordHash2 = await bcrypt.hash('secret', 10)

    const user1 = new User({ username: 'user', name: 'Admin', passwordHash: passwordHash1 })
    const user2 = new User({ username: 'user2', name: 'Tester', passwordHash: passwordHash2 })
    await user1.save()
    await user2.save()
  })

describe('creating a new user', () => {
  test('creation succeeds with a fresh username and a long enough passwords',async () => {
    const usersAtStart = await helper.usersinDB()

    await api
      .post('/api/users')
      .send(helper.uniqueUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersinDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(helper.uniqueUser.username))
  })

  test('should fail if the username is not unique', async () => {
    await api
      .post('/api/users/')
      .send(helper.notUniqueUser)
      .expect(400)
  })
  
  test('should fail if the password is missing', async () => {
    await api
      .post('/api/users/')
      .send(helper.userWithOutPassword)
      .expect(400)
  })
  
  test('should fail if the password is too short', async () => {
    await api
      .post('/api/users/')
      .send(helper.userWithTooShortPassword)
      .expect(400)
  })

})

after(async () => {
  await mongoose.connection.close()
})
