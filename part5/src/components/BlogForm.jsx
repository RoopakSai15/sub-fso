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
        data-testid='title-input'
        id='title-input'
        />
      author 
        <input 
        type='text'
        value={author}
        name="Author"
        onChange={(event) => setAuthor(event.target.value)}
        id='author-input'
        data-testid='author-input'
        />
      url 
        <input 
        type='text'
        value={url}
        name="Url"
        onChange={(event) => setUrl(event.target.value)}
        id='url-input'
        data-testid='url-input'
        />
        <br/>
        <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm