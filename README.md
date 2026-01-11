## `dev-cache.js`

This is a **Violentmonkey/Tampermonkey/Greasemonkey userscript** designed to cache network requests (`fetch` and `XHR`) for `arztsuche.116117.de`.

### Purpose

The primary goal is to **prevent hitting rate limits** while developing or testing against the live 116117 API. By caching responses locally, repetitive requests for the same data (e.g., reloading the page while debugging UI) won't trigger new network calls to the backend.

### Key Features

- **Automatic Caching**: Intercepts all `fetch` and `XMLHttpRequest` calls.
- **Smart Key Generation**: Generates cache keys based on method, URL, and body, while **ignoring volatile headers** (like timestamps or request IDs). This ensures that the cache remains valid and works effectively even when the random security key changes between visits.
- **Session Storage**: Saves responses in the browser's `sessionStorage`. Usage persists across page reloads (F5) but **automatically clears when you close the tab**, ensuring you don't work with stale data for too long.
- **Visual Feedback**: Logs `[CACHE HIT]`, `[CACHE MISS]`, and `[CACHE STORE]` activities to the browser console.
- **Management**: Injects a **"Clear Dev Cache" button** in the bottom-right corner of the page to easily flush stored data manually if needed.

### Installation Instructions

1. Install a userscript manager like **Violentmonkey** (Firefox) or **Tampermonkey** (Chrome/Edge).
2. **Easy Install**: Visit [GreasyFork](https://greasyfork.org/en/scripts/562278-116117-arztsuche-dev-cache) and click **"Install this script"**.
3. **Manual Install**:
   - Create a new script.
   - Copy the contents of `dev-cache.js` into the script editor.
   - Save the script.
4. Navigate to `https://arztsuche.116117.de/` and open the developer console to see it in action.

> **Warning**: This script is for **development purposes only**. Do not use it when you need live, up-to-date availability data for real appointments.
