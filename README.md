# AnimeDoll

> **AnimeDoll** is an AI-embedded anime-style smart plush charm (~10 cm) for bags and ita-bags—portable companionship with voice, vision, and cloud AI on the roadmap.  

**Live deck:** [animedoll.github.io](https://animedoll.github.io/) (GitHub Pages)

## Highlights

- Full-screen, keyboard-driven slide deck (~19 slides) with progress, dots, fullscreen, and **cyber / verdant** themes
- **Three.js** cover scene: draggable FBX preview (`model/`), loaded via CDN import map (no build step)
- Rich product narrative: requirements, concept, solution visuals, community flywheel—outlined in `docs/presentation_slides.md`
- Pure static site: **no backend**, **no `package.json`**; Three r170 from jsDelivr

## Overview

This repository is the **public presentation** for the AnimeDoll product concept. The default entry is `index.html`: slides, accessibility-minded controls (`aria-*`), and inline scripts for navigation and 3D. An experimental **Arknights-style** template lives in `arknights_template.html` and is not the main site entry.

**Who it’s for:** reviewers, collaborators, and anyone who wants a self-contained browser deck plus a single place for slide copy and asset layout.

**IP notice (demo assets):** The plush character shown in the deck (3D preview and visuals) is **fan-made / doujin-style work for presentation only**—not an official licensed product, and not affiliated with or endorsed by the original IP rights holders. To reduce copyright risk when creating or sharing similar fan works, follow the rights holder’s published fan-creation guidelines (for *Genshin Impact*–related reference, see [miHoYo’s notice on ys.mihoyo.com](https://ys.mihoyo.com/main/news/detail/116685)).

**Authors:** Maintained via this GitHub organization/repo; open an issue to reach maintainers.

## Usage

1. **Online:** open [animedoll.github.io](https://animedoll.github.io/) after Pages is enabled for this repo.
2. **Local:** serve the repo root over **HTTP** (ES modules and CDN assets behave more reliably than `file://`).

   Examples (pick any static server you already use):

   ```bash
   npx --yes serve .
   ```

   Then open the URL the tool prints (usually port 3000 or 5000).

**Controls:** arrow keys or space to change slides; use on-screen controls for theme and fullscreen. Cover 3D needs network access for the CDN and FBX.

## Installation

**Requirements:** a modern browser; network for Three.js and FBX loaders from CDN.

**Developers:** clone the repository and edit slides in `index.html` (`.slides-wrapper` / `.slide`). When changing structure or copy at scale, update `docs/presentation_slides.md` first, then sync `index.html`. Theme tokens live in `css/theme-*.css` and `css/presentation-layout.css`; theme preference may use `localStorage` key `animeDollTheme` (`verdant` | `cyber`).

| Path | Role |
|------|------|
| `index.html` | Main deck + cover 3D |
| `css/` | Layout and themes |
| `docs/presentation_slides.md` | Slide IA and source copy |
| `images/` | Figures, logos, scenes |
| `model/` | FBX assets for the cover |

Further maintainer notes: [`CLAUDE.md`](CLAUDE.md).

## Feedback and contributing

Use **Issues** for bugs or content fixes; describe the slide number or section when reporting deck problems. **Pull requests** are welcome—keep slide edits aligned with `docs/presentation_slides.md` and preserve accessibility attributes where present.
