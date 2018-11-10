importScripts('js/sw-util.js');

const static_cache = 'static-v2';
const dinamic_cache = 'dynamic-v1';
const inmutable = 'inmutable-v1';

const app_shell = [
    // '/',
    'index.html',
    // '/css/style.css',
    // 'img/favicon.ico',
    // 'img/avatars/hulk.jpg',
    // 'img/avatars/ironman.jpg',
    // 'img/avatars/spiderman.jpg',
    // 'img/avatars/thor.jpg',
    // 'img/avatars/wolverine.jpg',
    // '/js/app.js',
    // '/js/sw-util.js'

];

const app_schell_imut = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(static_cache).then(cache => {
        return cache.addAll(app_shell);
    });

    const cacheImut = caches.open(inmutable).then(cache => {
        return cache.addAll(app_schell_imut);
    });


    e.waitUntil(Promise.all([cacheStatic, cacheImut]));
});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {
        keys.forEach(element => {
            if (element !== static_cache && element.includes('static')) {
                return caches.delete(element);
            }
        });
    });


    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {
            return fetch(e.request).then(newRes => {
                return actualizarCacheDinamico(dinamic_cache, e.request, newRes);
            });

        }

    });
    e.respondWith(respuesta);
});