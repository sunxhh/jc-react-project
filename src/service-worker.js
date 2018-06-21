workbox.setConfig({ debug: false })
// Whether or not the service worker should skip over the waiting lifecycle stage.
workbox.skipWaiting()

// Whether or not the service worker should start controlling any existing clients as soon as it activates
workbox.clientsClaim()

// change these default names by altering all or some of the values
// https://developers.google.cn/web/tools/workbox/modules/workbox-core
workbox.core.setCacheNameDetails({
  prefix: 'jccy'
})

/*
* 设置缓存策略
* staleWhileRevalidate:当请求的路由有对应的 Cache 缓存结果就直接返回，
  在返回 Cache 缓存结果的同时会在后台发起网络请求拿到请求结果并更新 Cache 缓存，
  如果本来就没有 Cache 缓存的话，直接就发起网络请求并返回结果
* networkFirst:优先尝试拿到网络请求的返回结果
* cacheFirst:当匹配到请求之后直接从 Cache 缓存中取得结果，
  如果 Cache 缓存中没有结果，那就会发起网络请求，拿到网络请求结果并将结果更新至 Cache 缓存，并将结果返回给客户端
* networkOnly:直接强制使用正常的网络请求，并将结果返回给客户端
* cacheOnly:直接使用 Cache 缓存的结果，并将结果返回给客户端
*/
// workbox.routing.registerRoute(/\/.*/, workbox.strategies.networkFirst())

// 缓存cdn数据
workbox.routing.registerRoute(
  new RegExp('http(s?)://cdn.bootcss.com/*'),
  workbox.strategies.cacheFirst({
    plugins: [
      // 请求符合指定条件的返回结果可以被缓存
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

// sw-register网络请求优先
workbox.routing.registerRoute(
  /\/sw-register\.js/,
  workbox.strategies.networkFirst()
)

workbox.precaching.precacheAndRoute(self.__precacheManifest)
