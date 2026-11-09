# Rafael Z

Site de Rafael Z, cantor e compositor de Brasília: https://rafaelzeredo.github.io

Static site (no build step): `index.html`, `404.html`, `assets/`. Published with GitHub Pages from `main`.

The original site (65 commits, last commit `ec0f8ab`, 5 Sep 2024) is preserved as the tag `archive/original-site-2024-09-05` and the branch `archive/original-site-2024-09`.

Status: public since 9 Nov 2026 (indexable; `robots.txt` and `sitemap.xml` at the root). Every page carries a canonical URL, Open Graph/Twitter tags and Schema.org JSON-LD for one person, **Rafael Z** (`alternateName`: Raphael Z, Rafael Caynan, Raphael Caynan, CAINÃ, Rafael Zeredo, Rafael Martins Zeredo). Share images are in `assets/img/og/`. When adding a page, add it to `sitemap.xml` and give it the same head block.


## Safari Low Power Mode fallback (decorative videos)

With Low Power Mode on, Safari refuses `play()` and draws a grey start button. `assets/js/lpm-img-fallback.js` then swaps the refused *decorative* video (hero, sunset, format cards, Solo/Trio loops) for `<img src="same.mp4">`, which Safari animates. Same file, same crop; normal `<video>` playback is untouched elsewhere. To disable: set `window.RZ_LPM_IMG_FALLBACK=false` before the script, or append `?lpm=off` to test. To remove: delete its `<script>` tags in `index.html`, `solo/`, `trio/`. Checkpoint before this change: branch `backup/pre-lpm-img-fallback-2026-11-09` (`7a3e90e`).
