// ==UserScript==
// @name         116117 Arztsuche Dev Cache
// @namespace    dev-cache-116117
// @version      1.0
// @description  Caches fetch + XHR calls for arztsuche.116117.de. This can be used to not run into rate limits when using the site repeatedly. It's purpose is to ease development and not to be used in production.
// @match        https://arztsuche.116117.de/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function inject() {
  const script = document.createElement("script");
  script.textContent = `
  (function() {
    const DEV_MODE = true;

    // --- Key Funktion: nur fachlich relevante Daten ---
    function normalize(obj) {
      if (!obj) return null;
      try {
        const copy = JSON.parse(JSON.stringify(obj));
        // volatile Header entfernen
        if (copy.headers) {
          delete copy.headers["req-val"];
          delete copy.headers["x-request-id"];
          delete copy.headers["date"];
        }
        return copy;
      } catch {
        return null;
      }
    }

    function makeKey({ method, url, body, config }) {
      let payload = null;
      try {
        const parsed = JSON.parse(body || "{}");
        payload = parsed.data || parsed; // nur relevanter Payload
      } catch {}
      return JSON.stringify({
        method,
        url,
        data: payload,
        params: config?.params || null
      });
    }

    // --- FETCH Hook ---
    const realFetch = window.fetch;
    window.fetch = async function(input, init = {}) {
      const method = (init.method || "GET").toUpperCase();
      const url = typeof input === "string" ? input : input.url;

      const key = makeKey({ method, url, body: init.body, config: init });
      const hit = DEV_MODE && localStorage.getItem(key);

      if (hit) {
        console.log("[CACHE HIT][fetch]", method, url);
        const cached = JSON.parse(hit);
        return new Response(cached.body, cached.init);
      }

      console.log("[CACHE MISS][fetch]", method, url);
      const res = await realFetch(input, init);
      const clone = res.clone();
      const text = await clone.text();

      try {
        localStorage.setItem(key, JSON.stringify({
          body: text,
          init: {
            status: res.status,
            statusText: res.statusText,
            headers: [...res.headers]
          }
        }));
        console.log("[CACHE STORE][fetch]", method, url);
      } catch (e) {
        console.warn("[CACHE FAIL][fetch]", method, url, e);
      }

      return res;
    };

    // --- XHR Hook ---
    const realXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new realXHR();
      let method, url, body, config;

      const realOpen = xhr.open;
      xhr.open = function(m, u) {
        method = m.toUpperCase();
        url = u;
        return realOpen.apply(this, arguments);
      };

      const realSend = xhr.send;
      xhr.send = function(b) {
        body = b;
        config = {}; // placeholder falls nötig

        const key = makeKey({ method, url, body, config });
        const hit = DEV_MODE && localStorage.getItem(key);

        if (hit) {
          console.log("[CACHE HIT][xhr]", method, url);
          const cached = JSON.parse(hit);

          // echte XHR Properties beibehalten, nur Response überschreiben
          Object.defineProperty(xhr, "readyState", { value: 4 });
          Object.defineProperty(xhr, "status", { value: cached.status });
          Object.defineProperty(xhr, "responseText", { value: cached.body });
          Object.defineProperty(xhr, "response", {
            get() {
              try { return JSON.parse(cached.body); }
              catch { return cached.body; }
            }
          });

          xhr.getAllResponseHeaders = () => "";
          xhr.getResponseHeader = () => null;

          // Events dispatchen
          setTimeout(() => {
            xhr.dispatchEvent(new Event("readystatechange"));
            xhr.dispatchEvent(new Event("load"));
            xhr.dispatchEvent(new Event("loadend"));
          }, 0);

          return; // Original send nicht aufrufen
        }

        console.log("[CACHE MISS][xhr]", method, url);
        xhr.addEventListener("load", () => {
          try {
            localStorage.setItem(key, JSON.stringify({
              status: xhr.status,
              body: xhr.responseText
            }));
            console.log("[CACHE STORE][xhr]", method, url);
          } catch (e) {
            console.warn("[CACHE FAIL][xhr]", method, url, e);
          }
        });

        return realSend.apply(this, arguments);
      };

      return xhr;
    };

    console.log("[DEV CACHE] fetch + XHR patched for 116117 Arztsuche");

    // --- Cache Clear Button ---
    function insertButton() {
      if (!document.body) {
        requestAnimationFrame(insertButton);
        return;
      }

      const btn = document.createElement("button");
      btn.textContent = "Clear Dev Cache";
      btn.style.position = "fixed";
      btn.style.bottom = "10px";
      btn.style.right = "10px";
      btn.style.zIndex = 9999;
      btn.style.padding = "5px 10px";
      btn.style.background = "#ff5555";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "4px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "12px";
      btn.title = "Click to clear all cached data";

      btn.addEventListener("click", () => {
        localStorage.clear();
        console.log("[DEV CACHE] Cleared all cached data");
        alert("All Dev Cache cleared!");
      });

      document.body.appendChild(btn);
    }

    insertButton();

  })();
  `;
  document.documentElement.appendChild(script);
  script.remove();
})();
