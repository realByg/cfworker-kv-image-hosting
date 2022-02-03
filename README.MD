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

## 🏃 部署

> 环境：Nodejs 14 +

1. 安装 Cloudflare workers 的 CLI 工具 [wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) 并登录

    ```bash
    npm i @cloudflare/wrangler -g
    wrangler login
    ```

2. 下载或 `git clone` 仓库到本地并安装所需环境

    ```bash
    git clone https://github.com/realByg/cfworker-kv-image-hosting.git
    cd cfworker-kv-image-hostin/api
    npm i
    ```

3. 配置 `wrangler.toml` 文件，粘贴后修改下方带 `#` 部分：

    ```toml
    name = '' # subdomain.workers.dev 前缀
    workers_dev = true
    type = 'webpack'
    webpack_config = 'webpack.config.js'
    compatibility_date = '2021-12-14'

    [vars]
    ENV = 'prod'
    USERNAME = '' # 用户名
    PASSWORD = '' # 密码
    TTL = 3600 # cacheTtl 缓存时间 (>60)
    DEDUPE = false # 是否开启去重。开启则会使用文件的 arraybuffer 产生唯一 md5 并取前 8 位作为 id 覆盖原来的内容，会增加 CPU 消耗；不开启则会使用随机 8 位字符作为 id

    [[kv_namespaces]]
    binding = 'ImageKV'
    id = '' # 在 workers KV 页面创建 KV 后将 id 填入此

    [site]
    bucket = '../app/dist'
    entry-point = 'workers-site'
    ```

4. 运行 `wrangler publish` 发布 `worker`

## 🥞 问题

-   免费版 workers 对 CPU 的使用时间、KV 的读取和存储次数均有限制
