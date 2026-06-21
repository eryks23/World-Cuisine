# World Cuisine

An interactive single-page gallery and demo UI for exploring iconic dishes from around the world — built with plain HTML, CSS and jQuery.

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![No build step](https://img.shields.io/badge/build-none%20required-blue.svg)

## Description

World Cuisine is a static front-end project that showcases a small photo gallery of dishes (Sushi, Pizza, Tacos, Curry, Burger), each tagged with its country of origin. Visitors can hide/show or shuffle the gallery, open photos in a lightbox with a per-dish comment thread, maintain an editable "Dish list," and submit a demo contact form. It is aimed at front-end developers who want a compact, dependency-light reference for building interactive UI behavior (modals, toasts, list management, `localStorage` persistence) without a backend or build tool.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage / Quick Start](#usage--quick-start)
- [Core Functionality](#core-functionality)
- [Project Structure](#project-structure)
- [Limitations & Notes](#limitations--notes)
- [Contributing](#contributing)
- [License](#license)
- [Author / Contact](#author--contact)

## Key Features

- **Dish gallery** — five dishes with photo, name, country and a category tag (`Tradition`, `Street food`, `Comfort`, etc.).
- **Gallery controls** — hide all, show all, add/remove photo frames, and shuffle the grid into random order.
- **Lightbox mode** — toggle a click-to-enlarge view that opens a modal with the full-size photo and metadata.
- **Per-dish comments** — leave or remove comments on any photo from the lightbox; comments persist per dish in the browser and can be toggled on/off site-wide.
- **Editable dish list** — add a dish by name and country of origin, remove individual entries, or clear the list; changes persist across page reloads.
- **Demo contact form** — client-side validated form (name, message, e-mail, consent) that stores submissions locally to simulate a "Send" flow without a backend.
- **Random background color** — a small, animated background-color shuffler for visual demos.
- **Smooth in-page navigation** — animated scrolling between the Gallery, Dish list and Contact sections.
- **Responsive layout** — single-column layout on small screens, two-column layout on viewports ≥980px.

## Tech Stack

| Layer        | Technology                                              |
|--------------|----------------------------------------------------------|
| Markup       | HTML5                                                    |
| Styling      | CSS3 (custom properties, Flexbox, CSS Grid)              |
| Behavior     | JavaScript (ES6) with jQuery 3.6.0 (loaded from CDN)     |
| Fonts        | Google Fonts — Poppins (loaded from CDN)                 |
| Persistence  | Browser `localStorage` (no backend, no database)         |
| Build tools  | None — static files served as-is                         |

## Requirements

- A modern web browser (Chrome, Firefox, Edge, or Safari) with JavaScript and `localStorage` enabled.
- An internet connection on first load, to fetch jQuery and the Poppins font from their respective CDNs. Without it, the page still renders but loses jQuery-driven interactivity and falls back to system fonts.
- No language runtime, package manager, or build step is required to run the project.

## Installation

Clone the repository and move into the project directory:

```bash
git clone https://github.com/eryks23/World-Cuisine.git
cd World-Cuisine
```

No dependency installation step is needed — there is no `package.json`, virtual environment, or build pipeline. Proceed directly to [Usage / Quick Start](#usage--quick-start).

## Configuration

There are no environment variables and no `.env` file — the project has no backend to configure. The only "configuration" surfaces are:

**External resources loaded via CDN** (edit the `<link>`/`<script>` tags in `index.html` to change or self-host them):

| Resource          | Source                                                   |
|-------------------|-----------------------------------------------------------|
| jQuery 3.6.0      | `https://code.jquery.com/jquery-3.6.0.min.js`             |
| Poppins font      | `https://fonts.googleapis.com` (Google Fonts)             |

**`localStorage` keys used for persistence** (all client-side, never transmitted over the network):

| Key                          | Purpose                                                              |
|-------------------------------|-----------------------------------------------------------------------|
| `dish_list`                   | JSON array of entries shown in the "Dish list" widget                |
| `messages`                    | JSON array of demo contact-form submissions                          |
| `comments_for_<dish_title>`   | JSON array of comments left on a specific gallery photo              |
| `portfolio_hint_shown`        | Flag that suppresses the one-time "enable comments" onboarding toast |

## Usage / Quick Start

Open `index.html` directly in a browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows (PowerShell)
start index.html
```

Or serve it over HTTP, which avoids browser restrictions some setups apply to `file://` pages:

```bash
# Using Python 3 (no installation needed on most systems)
python3 -m http.server 8080
# then visit http://localhost:8080

# Using Node.js (no global install needed)
npx serve .
```

### Adding a new dish to the gallery

Gallery entries are static markup in `index.html`. To add one, copy an existing `.card` block inside `#gallery` and update the image, title and country:

```html
<div class="card" data-title="Ramen">
    <img src="image/ramen.png" alt="Ramen" data-title="Ramen"
         onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'><rect fill=\'%23f0e6d2\' width=\'100%\' height=\'100%\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%237a6a5a\' font-size=\'20\'>ramen.png</text></svg>'">
    <div class="meta"><strong>Ramen</strong><small>Japan</small>
        <div class="card-footer"><span class="tag">Comfort</span></div>
    </div>
</div>
```

Place the matching image file in `image/`. The `onerror` attribute falls back to an inline SVG placeholder if the image fails to load.

## Core Functionality

All interactivity lives in `jquery/script.js`, inside a single `$(function () { ... })` block. The functions below are the ones worth knowing if you plan to extend the script:

| Function                          | Purpose                                                                                  |
|-------------------------------------|-------------------------------------------------------------------------------------------|
| `showToast(text, time = 2200)`     | Displays a temporary toast notification in the bottom-right corner.                       |
| `addDish(name, country, save)`     | Appends a `<li>` to `#dish-list`; persists to `localStorage` when `save` is `true`.        |
| `saveList()` / `loadList()`        | Serializes the dish list to `localStorage` / restores it on page load.                     |
| `commentsKey(title)`               | Builds the `localStorage` key used to store comments for a given dish title.              |
| `getComments(title)` / `saveComments(title, arr)` | Reads / writes the comment array for a dish.                                |
| `renderCommentsFor(title)`         | Renders the comment thread and add-comment form inside the lightbox modal.                |
| `commentsEnabled()`                | Returns whether the "Portfolio comments" checkbox is currently checked.                   |

Other event handlers cover: gallery hide/show/frame/shuffle, lightbox open/close (click or `Escape`), dish-list add/remove/clear, contact-form submit/clear/validation, the random background-color button, and smooth-scroll navigation links.

## Project Structure

```
World-Cuisine/
├── index.html          # Single entry point — markup for header, gallery, dish list, contact form, modal
├── css/
│   └── style.css        # All styling: layout, gallery grid, buttons, forms, modal, comments
├── jquery/
│   └── script.js        # All client-side behavior (jQuery), including localStorage persistence
├── image/
│   ├── burger.png
│   ├── curry.png
│   ├── pizza.png
│   ├── sushi.png
│   └── tacos.png
├── README.md
└── LICENSE
```

## Limitations & Notes

- The contact form and comment system are **client-side demos only**. Submissions are written to `localStorage` and are never sent to a server or third party — they are only visible in the browser that submitted them.
- Data does not sync across browsers or devices, and clearing browser storage erases dishes, comments and messages.
- The page depends on two external CDNs (jQuery, Google Fonts) for full functionality; for an offline-capable deployment, download and self-host both.
- There is currently no automated test suite. Verify changes manually by exercising the UI controls described in [Usage / Quick Start](#usage--quick-start).

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/my-change`.
2. Keep changes scoped to one concern per branch (e.g., a single UI feature or fix).
3. Test manually in at least one Chromium-based and one Gecko-based browser before opening a PR.
4. Follow the existing code style: 4-space indentation, semicolons in JS, `lowerCamelCase` for functions and variables.
5. Open a pull request with a clear description of the change and, where relevant, before/after screenshots.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## Author / Contact

- Repository: [github.com/eryks23/World-Cuisine](https://github.com/eryks23/World-Cuisine)
- GitHub: [@eryks23](https://github.com/eryks23)
- Issues and feature requests: please use the [GitHub Issues](https://github.com/eryks23/World-Cuisine/issues) page.
