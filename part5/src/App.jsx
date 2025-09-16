import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'

function App() {
  const [notification, setNotification] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogsData => {
        setBlogs(sortBlogs(blogsData))})
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogger')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleNotification = (message, type) => {
    setNotification({ message, type})
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleError = (error) => {

  const errorMessage =
    error?.response?.data?.error || // from backend
    error?.message || // from network/Axios
    'unknown error'

  handleNotification(errorMessage, 'error')
}  

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("logging in with", username, password)

    try {
    const user = await loginService.login({
      username, password
    })

    window.localStorage.setItem(
      "loggedBlogger",
      JSON.stringify(user) 
    )

    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
    handleNotification(`Logged in as ${user.name}`, `success`)
    }catch(error){
      handleError(error)
    }
  }

  const handleLogOut = () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }
  
  const sortBlogs = (blogs) => {
    return blogs.sort((a,b) => b.likes - a.likes)
  }

  const updateLikes = async (Liked) => {
    const { title, author, url, id, likes } = Liked
    try {
      const updatedBlog = await blogService.update(id,{
        title,
        author,
        url,
        likes: likes+1,
      })
      setBlogs(
        sortBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    } catch(error) {
      handleError(error)
    }
  }

  const addBlog = async (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)

      setBlogs(blogs.concat(response))
      handleNotification(`added ${response.title} by ${response.author}`, 'success')
    }catch(error){
      handleError(error)
    }
  }
  const deleteBlog = async ({title, author, id}) => {
    try{
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      handleNotification(`removed ${title} by ${author}`, 'success')
    } catch (error) {
      handleError(error)
    }
  } 

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog}/>
        </Togglable>
      </div>
    )
  }
  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm 
            username={username}
            password={password}
            handleUsernameChange={({target}) => setUsername(target.value)}
            handlePasswordChange={({target}) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }
  return (
    <div>
      <h3>blogs</h3>
      <Notification notification={notification}/>

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogOut}>logout</button>
        {blogForm()}
        </div> 
      }
      <BlogList blogs={blogs} updateLikes={updateLikes} deleteBlog={deleteBlog} user={user} />
    </div>
  )
}

export default App
