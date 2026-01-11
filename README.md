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
2. **Easy Install**: Visit [GreasyFork](https://greasyfork.org/en/scripts/562278-116117-arztsuche-dev-cache-do-not-install-unless-dev) and click **"Install this script"**.
3. **Manual Install**:
   - Create a new script.
   - Copy the contents of `dev-cache.js` into the script editor.
   - Save the script.
4. Navigate to `https://arztsuche.116117.de/` and open the developer console to see it in action.

> **Warning**: This script is for **development purposes only**. Do not use it when you need live, up-to-date availability data for real appointments.

## `export-json.js`

This is a userscript designed to **export search results** from `arztsuche.116117.de` as a JSON file.

### Purpose

This tool allows users to capture the raw data returned by the API during a search (the doctor application) and save it locally for analysis or processing.

### Key Features

- **Silent Capture**: Passively listens to the background "api/data" network request used by the search.
- **Integrated UI**: Seamlessly inserts an **"Exportieren (JSON)"** link right next to the existing **"PDF ausdrucken"** button.
- **Native Look & Feel**: The link automatically adapts to the site's layout changes (e.g., resizing the window) and matches the existing style.
- **One-Click Download**: Clicking the link instantly downloads the captured data as `116117-api-data.json`.
- **Works with Cache**: Fully compatible with `dev-cache.js`, allowing you to export data even if it was served from the local developer cache.

### Installation Instructions

1. Install a userscript manager like **Violentmonkey** (Firefox) or **Tampermonkey** (Chrome/Edge).
2. **Easy Install**: Visit [GreasyFork](https://greasyfork.org/en/scripts/562284-116117-arztsuche-data-export-json) and click **"Install this script"**.
3. **Manual Install**:
   - Create a new script.
   - Copy the contents of `export-json.js` into the script editor.
   - Save the script.

## `export-csv.js`

This is a userscript designed to **export search results** as a **CSV file** (compatible with Excel).

### Purpose

This tool captures the raw data from the doctor search and processes it into a **human-readable table format** suitable for Excel. It flattens the complex data structure into clear columns like Name, Address, Contact Info, and Therapy Types, with separate columns for availability on specific dates.

### Key Features

- **CSV Conversion**: Automatically converts the complex JSON response into a flat CSV format.
- **Excel Friendly**: Handles special characters and formatting so it opens correctly in Excel.
- **Integrated UI**: Adds an **"Exportieren (CSV)"** button next to the existing **"PDF ausdrucken"** button.
- **One-Click Download**: Clicking the link instantly downloads the captured data as `116117-api-data.csv`.
- **Works with Cache**: Fully compatible with `dev-cache.js`, allowing you to export data even if it was served from the local developer cache.

### Installation Instructions

1. Install a userscript manager like **Violentmonkey** (Firefox) or **Tampermonkey** (Chrome/Edge).
2. **Manual Install**:
   - Create a new script.
   - Copy the contents of `export-csv.js` into the script editor.
   - Save the script.
3. Reload the arztsuche page to see the new button.
