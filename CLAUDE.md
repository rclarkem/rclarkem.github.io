# CLAUDE.md - Personal Portfolio Website

## Project Overview

This is a **static, single-page personal portfolio website** for Reina Mitchell, deployed on GitHub Pages with a custom domain (reinamitchell.com). The site is intentionally simple with no build process, using a single HTML file with all content and CDN-loaded dependencies.

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

- `HTML/blog.html` - Empty file, not linked from navigation
- `HTML/resume.html` - Empty file, not linked from navigation

These appear to be planned features not yet implemented.

## Recent Git History Context

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
