// Blog JavaScript Functions

// Global variable to store posts data
let postsData = null;

// ========================================
// ADMIN AUTHENTICATION SYSTEM
// ========================================

// Obfuscated admin password hash (SHA-256)
// Hash is split, reversed, and stored in chunks for obfuscation
const _h1 = '375d7939bd8a312c';
const _h2 = '319a6a40c7ea9faa';
const _h3 = 'e823cbdbd1505239';
const _h4 = '6aa8c6dac1b63dde';

// Reconstruct hash at runtime
function _getHash() {
    return [_h4, _h3, _h2, _h1].join('').split('').reverse().join('');
}

const ADMIN_PASSWORD_HASH = _getHash();

// Hash password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if admin is authenticated
function isAdminAuthenticated() {
    return sessionStorage.getItem('blogAdminAuth') === 'true';
}

// Show admin controls
function enableAdminMode() {
    document.body.classList.add('admin-mode');
}

// Hide admin controls
function disableAdminMode() {
    document.body.classList.remove('admin-mode');
}

// Prompt for admin password
async function promptAdminPassword() {
    const password = prompt('Enter admin password:');
    if (!password) {
        window.location.href = window.location.pathname;
        return;
    }

    const hash = await hashPassword(password);
    if (hash === ADMIN_PASSWORD_HASH) {
        sessionStorage.setItem('blogAdminAuth', 'true');
        enableAdminMode();
        // Remove ?admin from URL
        window.history.replaceState({}, '', window.location.pathname);
        alert('Admin mode enabled');
    } else {
        alert('Incorrect password');
        window.location.href = window.location.pathname;
    }
}

// Initialize auth on page load
function initAuth() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for ?admin parameter
    if (urlParams.has('admin')) {
        promptAdminPassword();
        return;
    }

    // Check existing session
    if (isAdminAuthenticated()) {
        enableAdminMode();
    } else {
        disableAdminMode();
    }
}

// Check editor access (for blog-editor.html)
function checkEditorAccess() {
    if (!isAdminAuthenticated()) {
        alert('Admin access required. Redirecting to login...');
        window.location.href = 'blog.html?admin';
    }
}

// ========================================
// END AUTHENTICATION SYSTEM
// ========================================

// Load blog posts from JSON file
async function loadBlogPosts() {
    try {
        const response = await fetch('../data/posts.json');
        postsData = await response.json();

        if (postsData.posts && postsData.posts.length > 0) {
            renderBlogTiles(postsData.posts);
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showEmptyState();
    }
}

// Render blog tiles on the listing page
function renderBlogTiles(posts) {
    const blogGrid = document.getElementById('blogGrid');
    const emptyState = document.getElementById('emptyState');

    if (!blogGrid) return;

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    blogGrid.innerHTML = '';

    posts.forEach(post => {
        const tile = createBlogTile(post);
        blogGrid.appendChild(tile);
    });

    if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// Create a single blog tile element
function createBlogTile(post) {
    const tile = document.createElement('a');
    tile.href = `blog-post.html?id=${post.id}`;
    tile.className = 'blog-tile';

    const thumbnail = post.thumbnail
        ? `<img src="${post.thumbnail}" alt="${post.title}">`
        : `<i class="fas fa-file-alt"></i>`;

    const formattedDate = formatDate(post.date);

    tile.innerHTML = `
        <div class="blog-tile-thumbnail">
            ${thumbnail}
        </div>
        <div class="blog-tile-content">
            <h3 class="blog-tile-title">${post.title}</h3>
            <p class="blog-tile-excerpt">${post.excerpt}</p>
            <div class="blog-tile-date">${formattedDate}</div>
        </div>
    `;

    return tile;
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show empty state when no posts
function showEmptyState() {
    const blogGrid = document.getElementById('blogGrid');
    const emptyState = document.getElementById('emptyState');

    if (blogGrid) {
        blogGrid.innerHTML = '';
    }

    if (emptyState) {
        emptyState.style.display = 'block';
    }
}

// Load and display a single post
async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        window.location.href = 'blog.html';
        return;
    }

    try {
        const response = await fetch('../data/posts.json');
        postsData = await response.json();

        const post = postsData.posts.find(p => p.id === postId);

        if (post) {
            renderSinglePost(post);
        } else {
            showPostNotFound();
        }
    } catch (error) {
        console.error('Error loading post:', error);
        showPostNotFound();
    }
}

// Render a single post on the post page
function renderSinglePost(post) {
    const postTitle = document.getElementById('postTitle');
    const postDate = document.getElementById('postDate');
    const postContent = document.getElementById('postContent');

    if (postTitle) {
        postTitle.textContent = post.title;
    }

    if (postDate) {
        postDate.textContent = formatDate(post.date);
    }

    if (postContent) {
        postContent.innerHTML = post.content;
    }

    // Set up edit button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.onclick = () => {
            window.location.href = `blog-editor.html?id=${post.id}`;
        };
    }

    // Set up delete button
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.onclick = () => confirmDelete(post);
    }
}

// Show post not found message
function showPostNotFound() {
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.innerHTML = `
            <div class="empty-state">
                <i class="far fa-file-alt"></i>
                <h2>Post Not Found</h2>
                <p>The post you're looking for doesn't exist.</p>
                <a href="blog.html" class="back-link">← Back to Blog</a>
            </div>
        `;
    }
}

// Confirm delete action
function confirmDelete(post) {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
        showDeleteInstructions(post);
    }
}

// Show delete instructions modal
function showDeleteInstructions(post) {
    const modal = document.getElementById('deleteModal');
    const instructions = document.getElementById('deleteInstructions');

    if (modal && instructions) {
        instructions.innerHTML = `
            <h3>To delete this post:</h3>
            <ol>
                <li>Open <code>data/posts.json</code> in your editor</li>
                <li>Find and remove the entry with id: <code>"${post.id}"</code></li>
                <li>Save the file</li>
                <li>Commit and push the changes to your repository</li>
            </ol>
            <p>The post will be removed from your blog after the changes are deployed.</p>
        `;
        modal.classList.add('active');
    }
}

// Initialize blog editor
function initializeBlogEditor() {
    // Check if we're editing an existing post
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        loadPostForEditing(postId);
    }
}

// Load post data for editing
async function loadPostForEditing(postId) {
    try {
        const response = await fetch('../data/posts.json');
        postsData = await response.json();

        const post = postsData.posts.find(p => p.id === postId);

        if (post) {
            document.getElementById('postTitle').value = post.title;

            // Set Quill editor content
            if (window.quill) {
                quill.root.innerHTML = post.content;
            }

            // Update page title
            const pageTitle = document.querySelector('.editor-header h1');
            if (pageTitle) {
                pageTitle.textContent = 'Edit Post';
            }
        }
    } catch (error) {
        console.error('Error loading post for editing:', error);
    }
}

// Save blog post
function saveBlogPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = window.quill ? quill.root.innerHTML : '';

    if (!title) {
        alert('Please enter a post title');
        return;
    }

    if (!content || content === '<p><br></p>') {
        alert('Please enter post content');
        return;
    }

    // Generate excerpt from content (first 150 characters of text)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const excerpt = textContent.substring(0, 150).trim() + '...';

    // Check if we're editing or creating
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const post = {
        id: postId || generatePostId(title),
        title: title,
        content: content,
        excerpt: excerpt,
        date: new Date().toISOString().split('T')[0],
        thumbnail: ''
    };

    showSaveModal(post, postId);
}

// Generate a URL-friendly post ID from title
function generatePostId(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Show save modal with JSON output
function showSaveModal(post, isEdit) {
    const modal = document.getElementById('saveModal');
    const jsonOutput = document.getElementById('jsonOutput');
    const modalTitle = document.querySelector('#saveModal .modal-header h2');
    const instructions = document.getElementById('saveInstructions');

    if (!modal || !jsonOutput) return;

    const jsonString = JSON.stringify(post, null, 2);
    jsonOutput.textContent = jsonString;

    if (isEdit) {
        modalTitle.textContent = 'Update Post';
        instructions.innerHTML = `
            <p>To update this post:</p>
            <ol>
                <li>Copy the JSON below</li>
                <li>Open <code>data/posts.json</code> in your editor</li>
                <li>Find the post with id: <code>"${post.id}"</code></li>
                <li>Replace the entire post object with the copied JSON</li>
                <li>Save, commit, and push the changes</li>
            </ol>
        `;
    } else {
        modalTitle.textContent = 'Save New Post';
        instructions.innerHTML = `
            <p>To add this post to your blog:</p>
            <ol>
                <li>Copy the JSON below</li>
                <li>Open <code>data/posts.json</code> in your editor</li>
                <li>Add this post object to the <code>"posts"</code> array</li>
                <li>Save, commit, and push the changes</li>
            </ol>
        `;
    }

    modal.classList.add('active');
}

// Copy JSON to clipboard
function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    const text = jsonOutput.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.querySelector('.btn-copy');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please select and copy manually.');
    });
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Cancel editing
function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
        window.location.href = 'blog.html';
    }
}
