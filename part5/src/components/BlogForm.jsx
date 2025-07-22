import { useState } from "react";

const BlogForm = ({addBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({ title, author, url });
    
    setTitle('');
    setAuthor('');
    setUrl('');
  }

  return (
    <form onSubmit={handleSubmit}>
      title 
        <input 
        type='text'
        value={title}
        name="Title"
        onChange={(event) => setTitle(event.target.value)}
        />
      author 
        <input 
        type='text'
        value={author}
        name="Author"
        onChange={(event) => setAuthor(event.target.value)}
        />
      url 
        <input 
        type='text'
        value={url}
        name="Url"
        onChange={(event) => setUrl(event.target.value)}
        />
        <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm