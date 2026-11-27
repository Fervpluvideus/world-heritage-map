# 世界古迹图 · 中文探索版 0.1

单文件网页，无需安装应用、下载地图或 API 密钥。尚未部署，也没有在联网浏览器实测；需要网络和支持 WebGL 的浏览器。

## 使用
- 电脑：打开 index.html。若浏览器限制 file:// 的跨域请求，在目录运行 `python -m http.server 8000`，访问 http://localhost:8000/。
- 手机：推荐将 index.html 上传到 GitHub Pages，访问网页后添加到桌面。安卓本地文件预览可能禁止脚本或跨域请求。
- GitHub Pages：新建公开仓库，上传 index.html（放在根目录），Settings → Pages → Deploy from a branch → main / (root) → Save。以 GitHub 实际显示的站点地址为准。
- 初始位置为罗马。缩放至城市街区范围，点击“查询当前区域古迹”。勾选类别可筛选当前已加载的对象。移动地图后需要再次查询。点古迹查看原名、类别和链接；有 Wikidata 编号时可以手动查询中文名称和简介。

## 数据和限制
- 底图：OpenFreeMap Liberty，OSM 衍生数据。按可用中文名称字段优先显示，缺失时底图回退英文、当地语言。保留数据来源与署名。
- 古迹：Overpass API 按可见范围在线查询 OSM 的 historic、heritage、ruins、部分宗教及博物馆等标签；不等于 Heritage Watch AI 的完整数据或官方文保名录。每次最多返回 10000 个对象，可能被服务限流或超时；仅供个人低频交互使用，不适合批量抓取。
- 地名搜索：Nominatim，仅在手动提交时请求。地理位置仅在用户主动授权后用于地图定位。
- Wikidata：按单个 QID 查询中文标签与简介（未自动改写所有点位；没有中文资料时保留原文）。没有接入机器翻译服务。
- 设置中可添加公开、具有访问授权、支持 CORS 和 HTTP Range 的矢量 PMTiles URL，自动识别图层；没有预接 Heritage Watch AI 的直链（未能核实）。外部图层不参与本地分类过滤，名称字段兼容性需实测。
- 本项目不存储账号或私密数据，查询会发送给对应第三方服务。第三方服务可用性、访问条款和更新由各提供者决定。

## 资料与许可
- https://www.openstreetmap.org/copyright （OSM 数据 ODbL）
- https://openfreemap.org/quick_start/
- https://wiki.openstreetmap.org/wiki/Overpass_API
- https://operations.osmfoundation.org/policies/nominatim/
- https://www.wikidata.org/wiki/Wikidata:Licensing （Wikidata 结构化数据 CC0）
- https://docs.protomaps.com/pmtiles/maplibre
- https://terria-catalog.prod.heritagewatch.ai/tools/ （原项目，仅作参考/入口）