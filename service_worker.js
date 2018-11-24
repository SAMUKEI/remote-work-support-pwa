// ServiceWorker

// キャッシュ名とキャッシュファイルの指定
const version = "v1::" //Change if you want to regenerate cache
const staticCacheName = `${version}static-resources`;
const urlsToCache = [
    '/',
    '/css/style.css',
    '/javascript/main.js',
];
const cdnsToCache = [
    '//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
    '//cdn.jsdelivr.net/npm/jquery.facedetection@2.0.3/dist/jquery.facedetection.min.js',
];

// インストール時の処理(キャッシュコントロール)
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches
            .open(staticCacheName)
            .then(function (cache) {
                cache.addAll(cdnsToCache)
                return cache.addAll(urlsToCache);
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function (response) {
                return response ? response : fetch(event.request);
            })
    );
});