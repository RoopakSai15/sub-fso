const lodash = require('lodash')

const dummy = () => {
  
  return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const blog = blogs.reduce((fav, curr) => 
  fav.likes > curr.likes ? fav : curr)

  return { title: blog.title, author: blog.author, likes: blog.likes}
}

const mostBlogs = (blogs) => {
  const authorsByBlogs = lodash.countBy(blogs, getAuthor)
  const authorWMostBlogs = findAuthorWMostBlogs(authorsByBlogs) 
  return {
    author: authorWMostBlogs,
    blogs: authorsByBlogs[authorWMostBlogs]
  }
}

const mostLikes = (blogs) => {
  const authorsByLikes = blogs.groupBy(blogs, getAuthor)
  const authorsWTotalLikes = getTotalLikes(authorsByLikes)
  return authorsWTotalLikes.reduce((mostLikes, curr) => {
    mostLikes.likes > curr.likes ? mostLikes : curr
  })
}

const getAuthor = (blog) => blog.author

const findAuthorWMostBlogs = (blogs) => {
  return Object.keys(blogs).reduce((a, b) => blogs[a] > blogs[b] ? a : b)
}

const getTotalLikes = (authorsByLikes) => {
  return Object.entries(authorsByLikes).map(([author, likes]) => {
    const totalLikes = blogs.reduce((blog, total) => total + blog.likes, 0)
    return { author: author, likes: totalLikes}
  })
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}