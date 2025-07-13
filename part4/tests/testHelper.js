const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  }
]

const newBlog = {
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2
}

const blogWNoLikes = {
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
}

const blogWNoTitle = {
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2
}

const blogWNoUrl = {
  title: 'React patterns',
  author: 'Michael Chan',
  likes: 7
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON()) 
}

const initialUsers = [
  {
    username: 'user',
    passwordHash: 'secret'
  },
  {
    username: 'user2',
    password: 'secret'
  },
]

const usersinDB = async () => {
  const users = await User.find({})

  return users.map(u => u.toJSON())
}

const loginUser = {
  username: 'root',
  password: 'sekret'
}
const uniqueUser = {
  username: 'unique',
  password: 'secret'
}

const notUniqueUser = {
  username: 'user',
  password: 'secret'
}

const userWithOutPassword = {
  username: 'user3'
}

const userWithTooShortPassword = {
  username: 'small',
  password: 'se'
}

const addLoginUser = async () => {
  const passwordHash = await bcrypt.hash(loginUser.password, 10)
  const user = new User({ username: loginUser.username, passwordHash })
  await user.save()
}

module.exports = {
  initialBlogs,
  blogsInDB,
  newBlog,
  blogWNoLikes,
  blogWNoTitle,
  blogWNoUrl,

  initialUsers,
  usersinDB,
  loginUser,
  uniqueUser,
  notUniqueUser,
  userWithOutPassword,
  userWithTooShortPassword,
  addLoginUser,

}