import './style.css'
import { marked } from 'marked'
import matter from 'gray-matter'

// Base path for GitHub Pages deployment
const BASE_PATH = import.meta.env.BASE_URL

// Router
class Router {
  constructor() {
    this.routes = {}
    this.currentRoute = null
    this.basePath = BASE_PATH.replace(/\/$/, '') // Remove trailing slash

    window.addEventListener('popstate', () => this.handleRoute())

    // Handle link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault()
        this.navigate(e.target.getAttribute('href'))
      }
    })
  }

  route(path, handler) {
    this.routes[path] = handler
  }

  navigate(path) {
    const fullPath = this.basePath + path
    window.history.pushState({}, '', fullPath)
    this.handleRoute()
  }

  handleRoute() {
    let path = window.location.pathname
    // Remove base path from pathname
    if (this.basePath && path.startsWith(this.basePath)) {
      path = path.slice(this.basePath.length) || '/'
    }

    const app = document.getElementById('app')

    if (path === '/' || path === '/index.html') {
      this.routes['/']?.()
    } else if (path.startsWith('/post/')) {
      const postId = path.replace('/post/', '')
      this.routes['/post']?.(postId)
    } else {
      app.innerHTML = '<div class="container"><div class="error">404 - Sayfa bulunamadı</div></div>'
    }
  }
}

// Blog Manager
class BlogManager {
  constructor() {
    this.posts = []
  }

  async loadPosts() {
    try {
      // posts/ klasöründeki tüm .md dosyalarını yükle
      const postFiles = [
        'welcome.md',
        'markdown-guide.md'
      ]

      const postsData = await Promise.all(
        postFiles.map(async (file) => {
          try {
            const response = await fetch(`${BASE_PATH}posts/${file}`)
            const content = await response.text()
            const { data, content: markdown } = matter(content)

            return {
              id: file.replace('.md', ''),
              title: data.title || 'Untitled',
              date: data.date || new Date().toISOString().split('T')[0],
              author: data.author || 'Anonymous',
              tags: data.tags || [],
              content: markdown,
              excerpt: this.getExcerpt(markdown)
            }
          } catch (error) {
            console.error(`Error loading ${file}:`, error)
            return null
          }
        })
      )

      this.posts = postsData.filter(post => post !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      return this.posts
    } catch (error) {
      console.error('Error loading posts:', error)
      return []
    }
  }

  getExcerpt(markdown) {
    const text = markdown.replace(/[#*`\[\]]/g, '').trim()
    const firstParagraph = text.split('\n\n')[0]
    return firstParagraph.length > 200
      ? firstParagraph.substring(0, 200) + '...'
      : firstParagraph
  }

  getPostById(id) {
    return this.posts.find(post => post.id === id)
  }
}

// UI Components
function renderHeader() {
  return `
    <header class="header">
      <div class="header-content">
        <a href="${BASE_PATH}" class="logo" data-link>
          <span class="logo-icon">📝</span>
          <span>GitNotes</span>
        </a>
      </div>
    </header>
  `
}

function renderHomePage(posts) {
  const postsHtml = posts.map(post => `
    <a href="${BASE_PATH}post/${post.id}" class="blog-card" data-link>
      <h2 class="blog-card-title">${post.title}</h2>
      <div class="blog-card-meta">
        <span>📅 ${formatRelativeTime(post.date)}</span>
        <span>👤 ${post.author || '@enesht'}</span>
      </div>
      <p class="blog-card-excerpt">${post.excerpt}</p>
      ${post.tags.length > 0 ? `
        <div class="blog-card-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
    </a>
  `).join('')

  return `
    ${renderHeader()}
    <main class="container">
      <h1 class="home-title">GitNotes</h1>
      <p class="home-subtitle">Git ile güçlendirilmiş basit blog platformu</p>
      <div class="blog-list">
        ${postsHtml || '<p class="loading">Henüz yazı yok...</p>'}
      </div>
    </main>
  `
}

function renderPostPage(post) {
  if (!post) {
    return `
      ${renderHeader()}
      <main class="container">
        <div class="error">Yazı bulunamadı</div>
        <a href="${BASE_PATH}" class="back-button" data-link>← Ana sayfaya dön</a>
      </main>
    `
  }

  const htmlContent = marked(post.content)

  return `
    ${renderHeader()}
    <main class="container">
      <a href="${BASE_PATH}" class="back-button" data-link>← Geri</a>
      <article>
        <div class="post-header">
          <h1 class="post-title">${post.title}</h1>
          <div class="post-meta">
            <span>📅 ${formatRelativeTime(post.date)}</span>
            <span>👤 ${post.author || '@enesht'}</span>
          </div>
          ${post.tags.length > 0 ? `
            <div class="post-tags">
              ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="post-content">
          ${htmlContent}
        </div>
      </article>
    </main>
  `
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) return 'Az önce'
  if (diffMins < 60) return `${diffMins} dakika önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 30) return `${diffDays} gün önce`
  if (diffMonths < 12) return `${diffMonths} ay önce`
  return `${diffYears} yıl önce`
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Initialize App
async function initApp() {
  const app = document.getElementById('app')
  const router = new Router()
  const blogManager = new BlogManager()

  // Show loading
  app.innerHTML = `
    ${renderHeader()}
    <div class="container">
      <div class="loading">Yükleniyor...</div>
    </div>
  `

  // Load posts
  await blogManager.loadPosts()

  // Define routes
  router.route('/', () => {
    app.innerHTML = renderHomePage(blogManager.posts)
  })

  router.route('/post', (postId) => {
    const post = blogManager.getPostById(postId)
    app.innerHTML = renderPostPage(post)
  })

  // Handle initial route
  router.handleRoute()
}

// Start the app
initApp()
