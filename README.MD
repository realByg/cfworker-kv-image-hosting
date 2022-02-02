# 🖼️ cfworker-kv-image-hosting

> Cloudflare workers KV 图床

## 📚 原理

[Cloudflare workers](https://developers.cloudflare.com/workers/) KV 支持使用 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) 格式存储数据，使用 `FormData` 将文件传输到 `workers` 后，调用 `Blob.stream()` 方法，并将与文件相关的属性如名称、大小等存入 `metadata`，将过期信息存入 `expiration`。

```javascript
await KV_NAMESPACE.put(key, item.stream(), {
    expiration,
    metadata: {
        name: item.name,
        uploadedAt: new Date().getTime(),
        size: item.size
    }
})
```

> 为什么不要使用 `Base64`？

> 将图片转换为 `Base64` 格式的 `dataURL` 之后，不仅体积会变大，每次获取图片时还需要先转换成 `Blob` 后再返回，并且在 KV 支持的 3 种存储格式中，`ReadableStream` 读取最快，`text/json` 最慢。

## 🏃 使用

TBD

## 🥞 问题

-   免费版 workers 对 CPU 的使用时间、KV 的读取和存储次数均有限制
