The dev-cache.js is a userscript that caches fetch + XHR calls for arztsuche.116117.de.

The previous solution was to use a local override.

For that create a local override of `arztsuche.116117.de/js/app-3.2.1.js`.

Locate the line where the `S` object is defined (search for `S = `) and wrap it with `wrapWithCache(S)`.

Then add this to the top of the script:

```javascript
function wrapWithCache(S) {
  if (!S || !S.A) return S;

  const A = S.A;

  function makeKey(method, url, data) {
    return JSON.stringify({
      method,
      url,
      data,
    });
  }

  if (A.get) {
    const realGet = A.get.bind(A);
    A.get = function (url, config) {
      const key = makeKey("GET", url);
      console.log("GET Key", key);
      const hit = localStorage.getItem(key);

      if (hit) {
        console.log("[CACHE HIT] GET", url);
        return Promise.resolve(JSON.parse(hit));
      }

      console.log("[CACHE MISS] GET", url);
      return realGet(url, config).then((res) => {
        try {
          const safe = { ...res, request: null };
          localStorage.setItem(key, JSON.stringify(safe));
          console.log("[CACHE STORE] GET", url);
        } catch (e) {
          console.warn("[CACHE FAIL] GET", url, e);
        }
        return res;
      });
    };
  }

  if (A.post) {
    const realPost = A.post.bind(A);
    A.post = function (url, data, config) {
      const key = makeKey("POST", url, data);
      console.log("POST Key", key);
      const hit = localStorage.getItem(key);

      if (url === "api/data") {
        if (hit) console.log("API DATA CALL [[HIT]]");
        else console.log("API DATA CALL [[MISS]]");
      }

      if (hit) {
        console.log("[CACHE HIT] POST", url);
        return Promise.resolve(JSON.parse(hit));
      }

      console.log("[CACHE MISS] POST", url);
      return realPost(url, data, config).then((res) => {
        try {
          const safe = { ...res, request: null };
          localStorage.setItem(key, JSON.stringify(safe));
          console.log("[CACHE STORE] POST", url);
        } catch (e) {
          console.warn("[CACHE FAIL] POST", url, e);
        }
        return res;
      });
    };
  }

  return S;
}
```
