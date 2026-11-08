# Rollback guide: homepage restructure (8 Nov 2026)

This guide restores the website exactly as it was **before** the homepage restructure and the new `/musica/` page.

## The saved state

| | |
|---|---|
| Live website | https://rafaelzeredo.github.io/ |
| Repository | `rafaelzeredo/rafaelzeredo.github.io` (local: `~/Desktop/ClaudeWorkspace/Website/rafael-z-site`) |
| Original branch | `main` (GitHub Pages publishes from `main`) |
| Original commit | `eba647069ef9adeeba3e97ac0de835462331ce71` (`eba6470`, "Homepage: Trio com Bruno Dourado card uses a new preview…") |
| Backup branch | `backup/pre-homepage-restructure-2026-11-08`, pointing at that commit, **on GitHub and locally** |
| Local tag (extra copy) | `backup/pre-homepage-restructure-2026-11-08-tag` |
| Working tree before the change | clean, identical to `origin/main`; nothing uncommitted had to be saved |

The backup branch must never be deleted or force-pushed.

## Restore the previous website (recommended: keeps all history)

Run these in Terminal, one after the other:

```bash
cd ~/Desktop/ClaudeWorkspace/Website/rafael-z-site
git checkout main
git pull
git fetch origin backup/pre-homepage-restructure-2026-11-08
git restore --source=origin/backup/pre-homepage-restructure-2026-11-08 --staged --worktree -- . ':!ROLLBACK_GUIDE.md'
git commit -m "Restore the website as it was before the homepage restructure (eba6470)"
git push origin main
```

What this does: every website file goes back to exactly its state at `eba6470`. Files added later (such as `musica/index.html`) are removed, and changed files (`index.html`, the four format/portfolio pages) return to their old versions. This guide is kept for reference. Nothing is deleted from Git history, so the restructure can be brought back later the same way, using the restructure commit instead of the backup branch.

GitHub Pages republishes automatically about a minute after the push. Check https://rafaelzeredo.github.io/ (reload with the cache cleared if the old page does not appear at once).

## Check before pushing (optional)

```bash
git diff --cached --stat origin/backup/pre-homepage-restructure-2026-11-08
```

Only `ROLLBACK_GUIDE.md` should be listed; that means the website files match the backup exactly.

## Look at the old version without changing anything

```bash
git switch --detach backup/pre-homepage-restructure-2026-11-08
python3 -m http.server 8000
```

Open http://localhost:8000, then return with `git switch main`.

## What not to do

- Do not use `git push --force` or `git reset --hard` on `main`.
- Do not delete the backup branch or the tag.
