import Blog from "./Blog"

const BlogList = ({blogs, updateLikes, deleteBlog, user }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} updateLikes={updateLikes} blog={blog} deleteBlog={deleteBlog} user={user} />
      ))}
    </div>
  )
}

export default BlogList