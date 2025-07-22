import Blog from "./Blog"

const BlogList = ({blogs, updateLikes }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} updateLikes={updateLikes} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList