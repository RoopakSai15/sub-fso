import { useState } from "react"

const Blog = ({ blog, updateLikes}) => {
    const [showDetails, setShowDetails] = useState(false)
    const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
    }

    return (
        <div className='blog' style={blogStyle}>
            <div>
                <strong>{blog.title}</strong> -{blog.author}
                <button onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? 'hide' : 'view'}
                </button>
            </div>
            {showDetails && 
            <>
                <a href={blog.url}>{blog.url} </a> 
                <div className="likes">
                    likes {blog.likes}
                    <button onClick={() => updateLikes(blog)}>like</button>
                </div>
                <p>Added by: {blog.user?.name || 'Unknown'}</p>
                
            </>
            }
        </div>
)}

export default Blog