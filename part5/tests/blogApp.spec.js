import { test, expect } from '@playwright/test'

const apiUrl = 'http://localhost:3003' // backend server
const frontendUrl = 'http://localhost:5173'

async function loginWith(page, {username, password}){
  await page.getByRole('button', {name: 'login'}).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

test.describe("Blog App", () => {
  test.beforeEach(async ({ request, page }) => {
    await request.post(`${apiUrl}/api/testing/reset`)

    // create users
    await request.post(`${apiUrl}/api/users`, {
      data: {
        username: 'root',
        name: 'Test User',
        password: 'sekret'
      }
    })

    await request.post(`${apiUrl}/api/users`, {
      data: {
        username: 'otheruser',
        name: 'Another User',
        password: 'password'
      }
    })
    await page.goto(frontendUrl)
  })

  test("Login Form is shown", async ({ page }) => {
    await page.getByRole('button', {name: 'login'}).click()
    
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
    await expect(page.getByRole('button', {name: 'cancel'})).toBeVisible()
    
  })

  test.describe("Login", () => {
    test("login with right credentials", async ({ page }) => {
      await loginWith(page, {username:'root', password:'sekret'})
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test("login with wrong credentials", async ({ page }) => {
        await page.getByRole('button', {name: 'login'}).click()

          
        await page.getByTestId('username').fill('sanggamesh')
        await page.getByTestId('password').fill('sekret')
        await page.getByRole('button', {name: 'login'}).click()

        const error = page.locator('.error')
        await expect(error).toHaveText(/invalid username or password/i)
        await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  test.describe("When logged in", () => {
    const firstBlog = {
      title: 'First Title',
      author: 'First Author',
      url: 'https://firstblog.com',
      likes: 2,
    }
    const secondBlog = {
      title: 'Second Title',
      author: 'Second Author',
      url: 'http://secondblog.com',
      likes: 1
    }

    const thirdBlog = {
      title: 'Third Title',
      author: 'Third Author',
      url: 'http://thirdblog.com',
      likes: 3,
    }

    test.beforeEach(async ({page}) => {
      await page.goto('http://localhost:5173')
      await loginWith(page, {username:'root', password:'sekret'})
    })

    test('a new blog can be created', async ({page}) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title-input').fill('Mama na vallane problems osthaya ra')
      await page.getByTestId('author-input').fill('Ravi')
      await page.getByTestId('url-input').fill('jogipetmucchatlu.in/blog')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Mama na vallane problems osthaya ra -Ravi')).toBeVisible()
      
    })

    test('blog can be liked', async ({page}) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title-input').fill(firstBlog.title)
      await page.getByTestId('author-input').fill(firstBlog.author)
      await page.getByTestId('url-input').fill(firstBlog.url)
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: firstBlog.title })
      await blog.getByRole('button', { name: 'view' }).click()

      const likeText = blog.locator('text=likes')
      await expect(likeText).toContainText('0')

      await blog.getByRole('button', { name: 'like' }).click()
      await expect(likeText).toContainText('1')
    })
    
    test('creator can delete the blog', async ({page}) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title-input').fill(secondBlog.title)
      await page.getByTestId('author-input').fill(secondBlog.author)
      await page.getByTestId('url-input').fill(secondBlog.url)
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: secondBlog.title })
      await blog.getByRole('button', { name: 'view' }).click()

            // Prepare to handle the confirm prompt
      page.once('dialog', async (dialog) => {
        // Optional: check the prompt message
        // expect(dialog.message()).toContain('remove')
        await dialog.accept()   // accept the confirm
      })

      await blog.getByRole('button', { name: 'remove' }).click()
      
      await expect(blog).not.toBeAttached()
    })

    test('delete button is only visible to the creator', async ({ browser, page}) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title-input').fill(thirdBlog.title)
      await page.getByTestId('author-input').fill(thirdBlog.author)
      await page.getByTestId('url-input').fill(thirdBlog.url)
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: thirdBlog.title })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      // new context for otheruser
      const context2 = await browser.newContext()
      const page2 = await context2.newPage()
      await page2.goto(frontendUrl)
      await loginWith(page2, { username: 'otheruser', password: 'password' })

      const blogByOther = page2.locator('.blog').filter({ hasText: thirdBlog.title })
      await blogByOther.getByRole('button', { name: 'view' }).click()
      await expect(blogByOther.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are sorted in ascending', async ({page}) => {
      const blogs = [firstBlog, secondBlog, thirdBlog]
      for (const b of blogs) {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title-input').fill(b.title)
        await page.getByTestId('author-input').fill(b.author)
        await page.getByTestId('url-input').fill(b.url)
        await page.getByRole('button', { name: 'create' }).click()
      }

      const allBlogs = page.locator('.blog')
      const count = await allBlogs.count()
      for (let i = 0; i < count; i++) {
        await allBlogs.nth(i).getByRole('button', { name: 'view' }).click()
      }

      const likeTexts = await allBlogs.locator('text=likes').allTextContents()
      const likes = likeTexts.map(t => Number(t.match(/\d+/)[0]))

      const sorted = [...likes].sort((a, b) => b - a)
      expect(likes).toEqual(sorted)
    })

  })
})