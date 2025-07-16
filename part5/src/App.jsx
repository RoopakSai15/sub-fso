import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

function App() {
  const [notification, setNotification] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService
      .getAll()
      .then(blogsData => {
        setBlogs(blogsData)})
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

  const addBlog = async (event) => {
    event.preventDefault()

    try{
      const response = await blogService.create({
        title, author, url
      })

      setBlogs(blogs.concat(response))
      setTitle('')
      setAuthor('')
      setUrl('')
      handleNotification(`added ${response.title} by ${response.author}`, 'message')
    }catch(error){
      handleError(error)
    }
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
  const blogForm = () => {
    return (
      <Togglable buttonLabel="create">
        <BlogForm
          addBlog={addBlog}
        />
      </Togglable>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h3>Blogs</h3>
      <Notification notification={notification}/>
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogOut}>logout</button>
          {blogForm()}
        </div> 
      <ul>
        {blogs.map((blog, i) =>
          <Blog 
          key={i}
          blog={blog}
          />
        )}
      </ul>
    </div>
  )
}

export default App
