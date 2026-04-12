# CLAUDE.md - Personal Portfolio Website

## Project Overview

This is a **static personal portfolio website with integrated blog** for Reina Mitchell, deployed on GitHub Pages with a custom domain (reinamitchell.com). The site is intentionally simple with no build process.

**Main Site**: Single-page portfolio (index.html) with all content and CDN-loaded dependencies
**Blog System**: Multi-page blog with JSON-based posts, rich text editor, and admin authentication

**Repository**: rclarkem/rclarkem.github.io
**Deployment Model**: Direct push to master branch auto-deploys via GitHub Pages

## Architecture

### Single-Page Structure

The entire website lives in `index.html` (655 lines) with anchor-based navigation:
- **Header/Navigation** (lines ~1-50): Fixed navbar with smooth scroll links
- **About Section** (lines ~51-150): Profile image, bio, stats counter
- **Skills Section** (lines ~151-250): Progress bars for technical skills
- **Experience Section** (lines ~251-362): Timeline-based work history
- **Projects Section** (lines 363-582): **CURRENTLY COMMENTED OUT** - Isotope-filtered portfolio grid
- **Contact Section** (lines ~583-655): Contact form and social links

### Why Single-File?

This architecture choice prioritizes:
- Zero build complexity - direct file editing
- Fast deployment - commit and push, no CI/CD
- Easy hosting - works on any static host
- Simplicity - no bundlers, transpilers, or package managers

### Dependencies (All CDN-Loaded)

**CSS Frameworks:**
- Bootstrap 4.3.1 - Grid system and components
- Font Awesome 5.15.1 - Icons
- Animate.css - Entrance animations

**JavaScript Libraries:**
- jQuery 3.4.1 - DOM manipulation
- Typed.js 2.0.11 - Typing animation in header
- Waypoints 4.0.1 - Scroll-triggered animations
- Owl Carousel 2.3.4 - Testimonial slider
- Isotope 3.0.6 - Project filtering (when projects uncommented)
- Magnific Popup 1.1.0 - Lightbox for project images

**Implications**: No `npm install`, no `package.json`. To update dependencies, change CDN URLs in index.html.

### Color Scheme

Primary colors defined in CSS/style.css:
- **Primary Purple**: `#7b00ff` (main accent, buttons, links)
- **Dark Background**: `#111` (navbar, footer, dark sections)
- **Light Background**: `#f8f9fa` (alternating sections)
- **Text Colors**:
  - Light sections: `#333`
  - Dark sections: `#fff`
- **Gradient Overlays**: Purple-to-transparent for hero sections

### JavaScript Initialization Sequence

From JS/script.js:

1. **Document Ready** (jQuery):
   - Initialize Typed.js for animated tagline
   - Set up smooth scrolling for anchor links
   - Configure navbar scroll effects (shrink on scroll)

2. **Waypoints Initialization**:
   - Counter animations for stats (trigger at 80% viewport)
   - Skill bar animations (trigger on scroll into view)

3. **Owl Carousel Setup**:
   - Testimonial slider with autoplay
   - Responsive breakpoints for item count

4. **Isotope Setup** (currently inactive):
   - Portfolio grid filtering by category
   - Layout mode: masonry
   - Filter buttons trigger re-layout

### Commented-Out Project Section

**Location**: index.html lines 363-582

**Why Commented**: Per commit `bef6bbf` - "temporarily remove project section to fix for heroku deployment elsewhere"

**Content When Uncommented**:
- Isotope-filtered portfolio grid
- Filter buttons: All, Web Design, Graphic Design, Mobile Apps
- Project cards with images, titles, categories, and lightbox links
- 12 sample projects with placeholder images

**To Re-enable**: Uncomment lines 363-582 and ensure Isotope CDN link is active in `<head>`

## Development Workflow

### Local Development

**Option 1**: Direct browser opening
```bash
open index.html  # macOS
```

**Option 2**: Local server (recommended for testing relative URLs)
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment

```bash
git add .
git commit -m "descriptive message"
git push origin master
```

Changes appear at reinamitchell.com within ~1-2 minutes (GitHub Pages build time).

### No Build Process

- No `npm run build`
- No `npm test`
- No linting configured
- No preprocessors (Sass, TypeScript, etc.)

Direct file editing → commit → push → live

## Content Editing Guide

### Updating Text Content

All text lives in index.html within semantic sections. Key areas:

**About Bio** (lines ~90-120):
```html
<div class="typing-text">I'm a <span class="typing"></span></div>
<!-- Typed.js animates roles: Software Engineer, Designer, Developer -->
```

**Experience Timeline** (lines ~280-350):
- Each role in a `.timeline-item` div
- Date badge + title + company + description

**Skills** (lines ~180-230):
- Progress bars with data-percent attributes
- Update both the attribute AND the inline width style

### Updating Images

**Profile Image**: `Public/profile-1.png` (referenced in About section)

**Project Images**: `Public/Proj-*.gif` and `Public/post-*.jpg` (when projects uncommented)

**Large Assets**: Several GIF files are 5-10MB. Consider optimization if performance is an issue.

### Updating Styles

**CSS/style.css** follows this structure:
1. Global resets and typography
2. Navbar styles (fixed, with scroll shrink effect)
3. Section-specific styles (about, skills, experience, etc.)
4. Responsive media queries at bottom

**Color Changes**: Search for `#7b00ff` to update primary purple throughout.

## Important Implementation Details

### Isotope Filtering (Projects Section)

When projects are uncommented, the filter buttons work via:

```javascript
$('.filter-button').click(function() {
    var value = $(this).attr('data-filter');
    $('.grid').isotope({ filter: value });
});
```

Each project card has a `data-category` attribute matching the filter values.

### Smooth Scroll Behavior

Navbar links use `#section-id` anchors. JS/script.js intercepts clicks and animates scroll:

```javascript
$('a[href*="#"]').on('click', function(e) {
    // Smooth scroll to target with offset for fixed navbar
});
```

### Counter Animations

Stats in About section (Projects, Clients, Happy Clients) use Waypoints + CountUp:

```javascript
$('.counter').each(function() {
    // Animates from 0 to data-count value when scrolled into view
});
```

### Placeholder Pages

- `HTML/resume.html` - Empty file, not linked from navigation (planned feature not yet implemented)

## Blog System

The blog is a static, file-based system with admin authentication for creating, editing, and deleting posts. Visitors can read posts, while authenticated admins have full CRUD capabilities.

### Blog Architecture

**File Structure:**
- `HTML/blog.html` - Blog listing page (tile grid of all posts)
- `HTML/blog-post.html` - Single post view page
- `HTML/blog-editor.html` - Post editor with Quill.js rich text editor
- `JS/blog.js` - All blog functionality and authentication system
- `CSS/blog.css` - Blog-specific styles matching main site design
- `data/posts.json` - JSON file containing all blog posts

**Design Philosophy:**
- No backend/database - all posts stored in JSON file
- Client-side rendering with JavaScript
- Session-based authentication for admin controls
- Manual deployment via git commits

### Blog Pages Overview

#### 1. Blog Listing (blog.html)

**Public View:**
- Grid of blog post tiles (responsive, 3 columns → 1 on mobile)
- Each tile shows: thumbnail/icon, title, excerpt, date
- Click tile to view full post
- Empty state if no posts exist

**Admin View (when authenticated):**
- All public features plus:
- "+ New" button in navbar to create posts
- "+ New" button in empty state

**Key Features:**
- Posts sorted by date (newest first)
- Smooth hover animations with color transitions
- Matches main site design (teal accent color #29f3c3)

#### 2. Single Post View (blog-post.html)

**Public View:**
- Post title, date, and formatted content
- "Back to Blog" link
- Clean, readable typography

**Admin View (when authenticated):**
- All public features plus:
- Edit button (opens post in editor)
- Delete button (shows deletion instructions modal)
- "+ New" button in navbar

**Post Display:**
- Renders HTML content from posts.json
- Supports headings, paragraphs, lists, images, links
- Responsive layout with proper spacing

#### 3. Blog Editor (blog-editor.html)

**Access Control:**
- Requires admin authentication
- Redirects to login if not authenticated
- Protected at page load via `checkEditorAccess()`

**Features:**
- Rich text editor powered by Quill.js 1.3.6
- Title input field
- Media button (instructions for image hosting)
- Save/Cancel actions
- Keyboard shortcut: Cmd/Ctrl+S to save

**Editor Toolbar:**
- Headers (H1-H6)
- Bold, italic, underline, strikethrough
- Text alignment
- Ordered/unordered lists
- Link and image insertion
- Format clearing

**Save Workflow:**
1. Click "Save Post" or press Cmd/Ctrl+S
2. Generates post object with auto-generated ID from title
3. Shows modal with JSON output and instructions
4. Copy JSON to clipboard
5. Manually add/update in `data/posts.json`
6. Commit and push changes to deploy

**Edit Workflow:**
1. Navigate to post, click "Edit" button
2. Editor loads with existing title and content
3. Make changes and save
4. Modal shows updated JSON with replacement instructions

### Admin Authentication System

**Authentication Type:** Session-based, client-side authentication

**How It Works:**

1. **Login Flow:**
   - Navigate to any blog page with `?admin` query parameter
   - Example: `blog.html?admin`
   - Password prompt appears
   - Enter password, validated against SHA-256 hash
   - On success: sessionStorage set, admin mode enabled, URL cleaned
   - On failure: alert shown, redirect to page without admin access

2. **Password Security:**
   - Password hashed with SHA-256 via Web Crypto API
   - Hash obfuscated in source code (split into 4 chunks, reversed)
   - Stored as constants `_h1`, `_h2`, `_h3`, `_h4` in JS/blog.js
   - Runtime reconstruction via `_getHash()` function
   - No plaintext password anywhere in codebase

3. **Session Management:**
   - Auth state stored in `sessionStorage.blogAdminAuth`
   - Persists for browser tab lifetime only
   - Expires when tab/browser closes
   - Each page checks auth status on load via `initAuth()`

4. **UI Control:**
   - Admin-only elements have `.admin-only` class
   - Hidden by default with CSS: `.admin-only { display: none !important; }`
   - Shown when authenticated: `body.admin-mode .admin-only { display: flex !important; }`
   - Body gets `.admin-mode` class when admin authenticated

5. **Protected Elements:**
   - "+ New" buttons in navbar (blog.html, blog-post.html)
   - Edit/Delete buttons on posts (blog-post.html)
   - Entire editor page (blog-editor.html)

**Authentication Functions (JS/blog.js):**

```javascript
// Core auth functions (lines 6-93)
hashPassword(password)          // SHA-256 hashing via Web Crypto API
isAdminAuthenticated()          // Check sessionStorage for auth
enableAdminMode()               // Add .admin-mode class to body
disableAdminMode()              // Remove .admin-mode class from body
promptAdminPassword()           // Show prompt, validate, set session
initAuth()                      // Initialize auth on page load
checkEditorAccess()             // Protect editor, redirect if not auth
```

**Security Notes:**

✅ **What This Protects:**
- Hides admin UI from casual visitors
- Prevents accidental edits by visitors
- Session-based (no permanent cookies)
- Password never stored in plaintext

⚠️ **Limitations (Inherent to Static Sites):**
- Client-side authentication only (no server validation)
- Password hash visible in JavaScript source (obfuscated but discoverable)
- Determined users can bypass via browser dev tools (modify sessionStorage)
- Suitable for personal blog, NOT for sensitive data or production systems
- Protects against casual visitors, not determined attackers

**Admin Access Workflow:**

```bash
# First time / New session
1. Navigate to: https://reinamitchell.com/HTML/blog.html?admin
2. Enter password when prompted
3. Admin controls appear
4. Session active until browser tab closes

# Subsequent page navigation
- Admin controls remain visible across blog pages
- No re-authentication needed within same session

# Session expired (new tab/browser restart)
1. Visit blog normally - no admin controls visible
2. Navigate to blog.html?admin to re-authenticate
```

### Blog Data Management

**Post Storage Format (data/posts.json):**

```json
{
  "posts": [
    {
      "id": "url-friendly-post-id",
      "title": "Post Title",
      "content": "<h2>HTML Content</h2><p>Post content here...</p>",
      "excerpt": "First 150 characters of text content...",
      "date": "YYYY-MM-DD",
      "thumbnail": ""
    }
  ]
}
```

**Post ID Generation:**
- Auto-generated from title (via `generatePostId()` function)
- Converts to lowercase, removes special chars, replaces spaces with hyphens
- Example: "My First Post!" → "my-first-post"
- Used in URLs: `blog-post.html?id=my-first-post`

**Excerpt Generation:**
- Auto-extracted from content HTML
- First 150 characters of text (HTML stripped)
- Appends "..." to end
- Displayed on blog listing tiles

**Manual Workflow (Required for Static Site):**

**Creating a Post:**
1. Navigate to editor (requires auth)
2. Write title and content
3. Click "Save Post"
4. Copy JSON from modal
5. Open `data/posts.json`
6. Add post object to "posts" array
7. Save file
8. `git add data/posts.json`
9. `git commit -m "blog: add post about X"`
10. `git push origin master`
11. Post appears on live site in 1-2 minutes

**Editing a Post:**
1. Click "Edit" on post (requires auth)
2. Modify content in editor
3. Click "Save Post"
4. Copy updated JSON
5. Open `data/posts.json`
6. Find post by ID
7. Replace entire post object
8. Save and deploy (steps 7-11 above)

**Deleting a Post:**
1. Click "Delete" on post (requires auth)
2. Confirm deletion
3. Modal shows instructions
4. Open `data/posts.json`
5. Find and remove post object by ID
6. Save and deploy

### Blog Dependencies

**Additional CDN Libraries (blog pages only):**
- **Quill.js 1.3.6** - Rich text editor for blog-editor.html
  - CSS: `https://cdn.quilljs.com/1.3.6/quill.snow.css`
  - JS: `https://cdn.quilljs.com/1.3.6/quill.js`
  - Theme: "snow" (clean white toolbar)
  - Custom toolbar config with headers, formatting, lists, media

**Shared Dependencies:**
- jQuery 3.4.1 (consistent with main site)
- Bootstrap 4.3.1 (for grid system)
- Font Awesome 5.15.1 (for icons)

### Blog Color Scheme

Matches main site with blog-specific accent:

- **Primary Accent**: `#29f3c3` (teal) - buttons, links, hover states
- **Dark Background**: `#272727` (navbar, text)
- **Light Background**: `#fff` (content cards, post background)
- **Gradient**: `linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)` (page background)
- **Border Accent**: `rgba(41, 243, 195, 0.1)` (subtle teal borders)

### Blog JavaScript Functions

**Key Functions in JS/blog.js:**

```javascript
// Post Loading & Rendering
loadBlogPosts()              // Fetch posts.json, render tiles
renderBlogTiles(posts)       // Create tile grid on listing page
createBlogTile(post)         // Generate single tile element
loadSinglePost()             // Load post by ID from URL params
renderSinglePost(post)       // Display post content and metadata

// Editor Functions
initializeBlogEditor()       // Initialize editor, load post if editing
loadPostForEditing(postId)   // Populate editor with existing post
saveBlogPost()               // Validate, generate JSON, show modal
generatePostId(title)        // Convert title to URL-friendly ID
showSaveModal(post, isEdit)  // Display save instructions modal

// Utility Functions
formatDate(dateString)       // Convert YYYY-MM-DD to "Jan 1, 2026"
showEmptyState()             // Display "no posts" message
showPostNotFound()           // Display 404-style message
confirmDelete(post)          // Confirm deletion action
showDeleteInstructions(post) // Show deletion modal
copyJSON()                   // Copy JSON to clipboard
closeModal(modalId)          // Close modal dialog
cancelEdit()                 // Exit editor with confirmation

// Authentication (documented above)
hashPassword()               // SHA-256 hashing
isAdminAuthenticated()       // Check session
enableAdminMode()            // Show admin controls
disableAdminMode()           // Hide admin controls
promptAdminPassword()        // Login flow
initAuth()                   // Initialize on load
checkEditorAccess()          // Protect editor
```

### Blog CSS Structure (CSS/blog.css)

**File Organization:**
1. Global styles (lines 1-26) - Reset, typography, fonts
2. Navbar styles (lines 27-112) - Fixed navbar, buttons, social links
3. Main content (lines 113-163) - Container, page header
4. Blog tiles grid (lines 164-298) - Listing page tile layout
5. Single post view (lines 299-426) - Post header, content, actions
6. Editor styles (lines 427-555) - Editor container, Quill customization
7. Modal styles (lines 556-655) - Save/delete modals
8. Empty state (lines 656-673) - No posts message
9. Responsive design (lines 674-728) - Mobile breakpoints
10. Admin authentication (lines 730-756) - Admin-only element visibility

**Key Style Features:**
- Smooth transitions on all interactive elements
- Hover effects with color shifts and transforms
- Card-based design with subtle shadows
- Responsive grid (3 columns → 1 on mobile)
- Consistent with main site font stack (Poppins, Oswald)

## Recent Git History Context

- **Blog System Implementation** (pending commit):
  - Added complete blog system with listing, post view, and editor pages
  - Implemented session-based admin authentication
  - Created JSON-based post storage system
  - Added Quill.js rich text editor
  - Blog-specific styles matching main site design

- `c5f31be` - Updated profile about me section
- `4b9c116` - General profile updates
- `cce80d1` - Bio details, contact email, experience/project counts adjusted
- `bef6bbf` - **Project section commented out** for Heroku deployment fix
- `596e8e3` - Fixed typo in experience section

## Domain Configuration

Custom domain `reinamitchell.com` is configured via:
- CNAME file in repository root
- DNS settings pointing to GitHub Pages servers

Do not delete the CNAME file or the custom domain will break.
