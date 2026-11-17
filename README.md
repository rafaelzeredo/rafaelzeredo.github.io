# Rafael Z

Site de Rafael Z, cantor e compositor de Brasília: https://rafaelzeredo.github.io

Static site (no build step): `index.html`, `404.html`, `assets/`. Published with GitHub Pages from `main`.

The original site (65 commits, last commit `ec0f8ab`, 5 Sep 2024) is preserved as the tag `archive/original-site-2024-09-05` and the branch `archive/original-site-2024-09`.

Status: public since 9 Nov 2026 (indexable; `robots.txt` and `sitemap.xml` at the root). Every page carries a canonical URL, Open Graph/Twitter tags and Schema.org JSON-LD for one person, **Rafael Z** (`alternateName`: Raphael Z, Rafael Caynan, Raphael Caynan, CAINÃ, Rafael Zeredo, Rafael Martins Zeredo). Share images are in `assets/img/og/`. When adding a page, add it to `sitemap.xml` and give it the same head block.


## Safari Low Power Mode fallback (decorative videos)

With Low Power Mode on, Safari refuses `play()` and draws a grey start button. `assets/js/lpm-img-fallback.js` then swaps the refused *decorative* video (hero, sunset, format cards, Solo/Trio loops) for `<img src="same.mp4">`, which Safari animates. Same file, same crop; normal `<video>` playback is untouched elsewhere. To disable: set `window.RZ_LPM_IMG_FALLBACK=false` before the script, or append `?lpm=off` to test. To remove: delete its `<script>` tags in `index.html`, `solo/`, `trio/`. Checkpoint before this change: branch `backup/pre-lpm-img-fallback-2026-11-09` (`7a3e90e`).


## The "elevate" layer (16 Nov 2026, branch `elevate/2026-11-16`, not yet published)

Atmosphere, depth and motion added on top of the existing pages, as progressive enhancement:

- `assets/css/fx.css` + `assets/js/fx.js` (loaded by every page): reading-progress line, film grain (`assets/img/fx/grain.png`), headlines that rise line by line, outlined section numerals, pointer tilt on cards/covers, a pointer label on things you can drag/open/enlarge, animated open/close of the "Momentos" entries, record sleeves on `/musica/`, page-to-page view transitions, scroll-driven parallax where the browser supports it.
- `assets/js/sol.js`: "O Sol", a WebGL shader sun behind every booking headline. Loaded only when its section is near; ~30 fps while visible; one frame with reduced motion; CSS sun if WebGL is missing.
- The Djavan entry in "Momentos" (`#djavan-2014`) opens an archive panel with the **original flyer**, stored untouched (byte-identical to the file in the archive, MD5 `d0213c2feb4fc2b938569c3eea72e766`) at `assets/archive/djavan_2014_flyer_original.jpg`. Clicking it opens the `<dialog id="lightbox">`. Wording rule: a lounge set on a separate stage before the main concert; never "opened for Djavan".
- Switch everything off for a test with `?fx=off` (or `window.RZ_FX=false`); the archive panel and lightbox still work. Reduced-motion is respected.
- Also fixed: the "Voltar ao site" link on `/ao-vivo/` never appeared (reveal safety net added to `assets/js/pages.js`).
