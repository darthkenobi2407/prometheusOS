# PrometheusOS

A small browser-based desktop environment prototype.

## Run locally

Serve this folder with any static web server, then open its local URL. This makes browser storage behave consistently. Deploy the folder to Vercel as a static site.

## Current features

- Local account setup and login screen
- Notes saved in browser storage
- Simple simulated terminal
- About This Computer window
- My Site window that embeds the personal website
- macOS-inspired menu bar, windows and dock
- Windows XP Bliss wallpaper loaded from an external image URL

## Account storage note

This is a **local-only prototype**, not production authentication. The account ID and a salted PBKDF2 password hash are stored in the current browser's `localStorage`; the active login state is kept in `sessionStorage`. Accounts do not sync between browsers or devices, and browser storage can be changed or cleared by the user. For real accounts, use a backend authentication service and database.

The website app embeds `https://darthkenobi2407.github.io/personal-site/`. If that page cannot be embedded in a browser, use the **Open in new tab** link in the app window.
