import '@testing-library/jest-dom'
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
    title: 'RIP Ozzy Ozbourne',
    author: 'Roopak',
    url: 'instagram.com/notes',
    likes: 1,
    user: {
      username: 'joesaf',
      name: 'Yoetef'
    }
  }

const currentUser = {
  username: 'joesaf',
  name: 'Yoetef'
}

let component

const updateLikes = vi.fn()
const viewHide = vi.fn()

beforeEach(() => {
  component = render(<Blog blog={blog} updateLikes={updateLikes} user={currentUser} />)
})

test('renders content', () => {
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes)
})

test('when view is called url and likes are displayed', async () => {
  const user = userEvent.setup()
  const viewButton = component.getByText('view')
  await user.click(viewButton)
  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)
  expect(component.container).toHaveTextContent(blog.user.name)
})

test('clicking the like button twice calls the event handler twice', async () => {
  const user = userEvent.setup()
  const viewButton = component.getByText('view')
  await user.click(viewButton)
  const likeButton  = component.getByText('like')
  await user.dblClick(likeButton)
  expect(updateLikes.mock.calls).toHaveLength(2)
})
