import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test('should call the event handler with right details when blog is created', async () => {
  const addBlogMock = vi.fn()
  const component = render(<BlogForm addBlog={addBlogMock}/>)

  const blog = {
    title: 'Testing123',
    author: 'Tester',
    url: 'http://testing.com/123'
  }

  const user = userEvent.setup()
  const titleInput = component.container.querySelector('#title-input')
  const authorInput = component.container.querySelector('#author-input')
  const urlInput = component.container.querySelector('#url-input')
  const createButton = component.getByText('create')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)
  await user.click(createButton)

  expect(addBlogMock.mock.calls).toHaveLength(1)
  expect(addBlogMock.mock.calls[0][0]).toEqual(blog)
})