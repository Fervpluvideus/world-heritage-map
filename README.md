<div align="center">

<h1>🌏 世界古迹图</h1>
<p><strong>World Heritage Map</strong></p>

<h3>文明各有其语言，而人类共享其历史。</h3>

<p>跨越语言的边界，探索人类文明的共同记忆。</p>

<a href="https://fervpluvideus.github.io/world-heritage-map/"><img alt="打开世界古迹图" src="https://img.shields.io/badge/在线探索-Live%20Map-28594d?style=for-the-badge"></a>
<a href="https://github.com/Fervpluvideus/world-heritage-map"><img alt="版本 0.31" src="https://img.shields.io/badge/Version-0.31-8b704b?style=for-the-badge"></a>
<a href="https://github.com/Fervpluvideus/world-heritage-map/issues"><img alt="反馈与建议" src="https://img.shields.io/badge/反馈与建议-Issues-526b63?style=for-the-badge"></a>

<p><strong>全球古迹探索 · 中文统一展示 · 历史地图叠加</strong></p>

</div>

---

## 关于世界古迹图

**以中文为统一展示语言，探索世界各地的历史遗存。**

世界古迹图是一款面向中文用户的全球古迹探索地图，致力于将不同国家、不同语言记录的古迹名称与历史资料尽可能统一为中文展示。

通过多源古迹数据库、多语言名称匹配、维基资料关联及可选的 DeepSeek AI 翻译，让中文用户能够跨越语言障碍，发现、阅读与理解世界各地的历史遗存。同时保留原始名称与资料来源，便于进一步查证。

不局限于 UNESCO 世界遗产，也涵盖历史建筑、文物古迹、考古遗址、城堡、古战场、废墟、纪念碑与工业遗产，并支持历史地图叠加，探索城市空间的变迁。

> 中文化的不只是地图界面，更是地图所承载的历史信息。

**English summary:** World Heritage Map is a Chinese-first interactive global historical sites and cultural heritage map. It aims to present historical place names and heritage information consistently in Chinese wherever possible, using multilingual data matching, Wikipedia and Wikidata links, and optional DeepSeek AI translation while preserving original names and source references. Explore historic buildings, archaeological sites, castles, monuments, ruins and georeferenced historical maps. The main interface is in Simplified Chinese.

## 在线使用 | Live Map

### [打开世界古迹图 →](https://fervpluvideus.github.io/world-heritage-map/)

支持手机与电脑浏览器，无需安装或注册。基础地图、古迹浏览、维基资料查询和历史地图叠加无需 API Key；DeepSeek AI 功能可按需配置。

## 项目初衷

世界各地的历史建筑、考古遗址与文化遗产，往往以当地语言命名和记录。尤其是知名度较低的地方性古迹，即使已经被收录于地理数据库，也可能缺少其他语言的译名与介绍。对于不熟悉当地语言的人而言，在地图上找到一处古迹，并不意味着能够理解它的历史。

世界古迹图正是为降低这一障碍而创建。

本项目整合 Heritage Watch AI、OpenStreetMap、Wikidata、Wikipedia、UNESCO 与 Pleiades 等数据与知识来源，将分散的遗产记录置于同一张交互式地图中。通过多语言名称匹配、维基百科资料关联，以及可选的 DeepSeek API 翻译和联网检索，尽可能统一古迹信息的展示语言，同时保留原始名称、数据来源和相关链接，方便进一步查证。

在此基础上，项目还引入 OpenHistoricalMap、Allmaps 与 David Rumsey 的历史地图资源，支持将现代地理空间与历史地图相互对照，探索历史遗存与城市空间的变迁。

目前以简体中文为主要展示语言，未来计划逐步支持更多语言。统一展示语言并非取代原始语言，而是让不同语言背景的人能够更加便捷地接近历史。


## 核心功能

### 01 · 古迹信息中文化

- 中文名称优先：利用原始数据、多语言字段及 Wikidata／Wikipedia 关联获取已有中文名；未获得中文名时保留英文或当地语言。
- 可选 DeepSeek 助手：支持翻译外文简介、按需联网检索，以及随地图移动持续翻译古迹名称。
- 地图右下角同一按钮开启或停止全图自动翻译，新进入视野的遗址名称分批更新，无需逐个点开详情。
- AI 译名本地缓存，保留原名并标注未核实；后续获得可靠中文名称时优先使用来源数据中的中文名。
- 联网介绍仅呈现与目标古迹相关的有来源资料；未找到可靠匹配时直接提示，不列出无关检索结果。

### 02 · 全球古迹探索

- 接入全球 OSM 古迹、Wikidata 古迹、古迹轮廓、受损／已毁专题、各国开放遗产名录及其边界，以及 UNESCO 世界遗产、Pleiades 古代地名。
- 提供 31 种古迹分类，支持类别、存续状态与遗产认定记录筛选、同类点位聚合及当前范围古迹列表；可独立隐藏第七级未命名点位及第六级仅有名称的点位。
- 支持统一的地点与古迹搜索：提交名称后通过 Nominatim 查询全球城市、地区与已索引地标，同时普通关键词或可选 DeepSeek 语义匹配当前视野内已加载的古迹，包括被聚合或遮挡的记录。
- 移动与缩放期间持续刷新古迹，对已加载瓦片进行屏幕边缘缓冲预计算；名称从缩放等级 9 起显示，保留防遮挡机制。图标冲突时优先显示有遗产认定记录或较完整资料的古迹。显示优先级不等于历史价值。
- 支持原始记录链接、维基百科简介及关联图片，并保留可获得的图片作者与授权信息。

### 03 · 历史地图与地理对照

- OpenHistoricalMap：按年份叠加具有时间信息的道路、建筑、水系等历史矢量要素。
- Allmaps：根据地图中心查找已配准的历史地图，支持覆盖范围定位、透明度调整及瓦片加载反馈。
- David Rumsey：支持 Allmaps 关联馆藏筛选，以及从原站导入可用的 XYZ 瓦片链接。并非整个馆藏都能直接叠加。
- 独立的馆藏选择面板，支持卡片展开、地图切换动画及格式重试。底部操作栏可暂时隐藏、恢复或关闭历史地图叠加。

### 04 · 底图与移动端体验

- 性能优化：脚本预加载、优先启动核心点图层、次要数据延后加载、状态图标按需生成、分类缓存、聚合增量比较、静止时不重复聚合、自动翻译复用当前视野结果、大型 CSV 解析分段让出主线程。

- 左下角显示动态公制比例尺，随地图位置和缩放变化，自动切换米与千米单位。

- 图层连接详情和数据说明默认折叠；底部保留简短署名及可展开的完整来源与许可信息。

- V0.29：卫星图源仅保留 ArcGIS World Imagery，标注「仅交流学习使用」。直接使用 Esri 服务，公开网站使用授权尚待核实；说明文字不构成授权。

- V0.27：中性实时磨砂玻璃，使用浏览器 backdrop-filter 对当前地图画面模糊；支持关闭效果。
- V0.31：古迹轮廓与点位独立显示，从缩放等级 5 起展示轮廓（以数据源可用瓦片为准），不受 2500 条点位上限及新增优先级筛选影响；七大轮廓配色适配路网与卫星底图，重叠时图标点击优先。新增隐藏未命名／无介绍古迹点位，筛选先于数量限制，设置自动保存。主界面加入项目标语，统一按钮水波纹并关闭原生触摸高亮。
- V0.30（历史记录）：恢复屏幕内古迹数量保护。符合筛选的记录超过 2500 条时静默隐藏古迹图标、名称及轮廓，降至 2500 条及以下自动恢复；不将屏幕外预加载缓冲计入上限。图标从原有的缩放等级 5 起显示，名称从等级 9 起显示。

- 标准矢量地图、纯卫星影像、卫星混合（保留地名）三种底图；卫星影像仅采用 ArcGIS World Imagery。
- 卫星影像非实时，分辨率与覆盖随地点而异；加载失败自动重试同一图源，支持手动重载，不自动切换至标准底图。
- 中性磨砂玻璃与古铜金强调色，适配浅色、深色与减少动态效果偏好；可关闭玻璃模糊以减少 GPU 负担。

- 统一古迹搜索入口、右下角独立定位按钮；无法自动定位时以沈阳为默认位置。
- 可收起的顶部菜单（古迹搜索、历史地图、图层分类、AI 设置）、四个主功能入口采用上图标下文字布局、点击回弹和涟漪动画，保留动画详情面板及固定关闭按钮。
- 自动记忆古迹分类、图层、状态筛选及聚合等显示偏好。

## 使用指南

| 想做什么 | 操作方式 |
| --- | --- |
| 浏览古迹 | 搜索地点或移动地图，点击古迹图标、聚合点或古迹轮廓 |
| 切换底图 | 图层分类 → 地图底图 → 标准／卫星／卫星混合 |
| 寻找特定类型 | 展开图层分类菜单，选择所需类别 |
| 搜索城市、地区或古迹 | 古迹搜索 → 输入名称 → 搜索；全球地点与当前范围古迹分别显示，AI 匹配可选 |
| 查看历史资料 | 打开详情，查看关联图片、维基百科简介或原始记录 |
| 持续中文化 | 在 AI 设置配置密钥与模型，点击定位按钮上方的翻译图标开启；再次点击原位置停止 |
| 查看历史矢量地图 | 历史地图 → OpenHistoricalMap，选择年份 |
| 叠加馆藏老地图 | 选择馆藏老地图 → 查找附近地图 → 核查原图授权 → 叠加到地图 |

## DeepSeek 使用与费用控制

AI 为可选功能，不影响基础地图使用。用户需自行提供 DeepSeek API Key 并选择可用模型。

| 项目 | 当前策略 |
| --- | --- |
| 自动翻译 | 每批最多 30 个名称；与名称显示同步，从缩放等级 9 起，地图停稳约 0.5 秒后开始检查新名称 |
| 自动请求上限 | 不设累计数量上限；刷新网页后默认关闭；首次确认可勾选不再提示并记忆 |
| 失败处理 | 网络、限流与输出异常最多额外重试两次；密钥无效、余额不足等错误不反复请求 |
| 缓存 | 最多保存 6000 条 AI 译名，已缓存或已有中文名称的记录不重复翻译 |
| AI 列表匹配 | 单次最多 600 条已加载记录，主动调用，不联网搜索 |
| 停止 | 地图右下角同一个按钮切换为停止图标；终止后续请求，但已经提交的请求仍可能产生费用 |

名称批量翻译仅调用模型，不进行联网搜索；古迹详情中的联网检索为独立的按需操作。所有 API 调用均可能产生费用。请勿将 AI 译名视为正式地名，也不要以 AI 生成的历史介绍替代原始资料。

地图、图片、简介和老地图加载依赖网络及第三方服务；实际覆盖、响应速度和可用性因地区及数据来源而异。

## 数据来源与许可

| 来源 | 用途 | 许可或说明 |
| --- | --- | --- |
| [Heritage Watch AI](https://terria-catalog.prod.heritagewatch.ai/tools/) | 全球古迹矢量数据及建筑轮廓 | 按上游数据来源及许可使用 |
| [UNESCO DataHub](https://data.unesco.org/explore/dataset/whc001/) | 世界遗产及分项坐标 | CC BY-SA 4.0；不自动复用第三方图像 |
| [Pleiades](https://pleiades.stoa.org/downloads) | 古代地名及代表坐标 | CC BY 3.0，须保留贡献者署名 |
| [OpenHistoricalMap](https://www.openhistoricalmap.org/copyright) | 历史矢量要素 | 通常 CC0，部分要素独立开放许可 |
| [Allmaps](https://allmaps.org/data) | 地理配准与瓦片叠加 | 配准数据 CC0；原图另行授权 |
| [David Rumsey Map Collection](https://www.davidrumsey.com/about/copyright-and-permissions) | 历史地图馆藏 | 逐幅核查原图及服务许可 |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | 地理数据、古迹与受损对象 | ODbL 1.0 |
| [Wikidata](https://www.wikidata.org/wiki/Wikidata:Licensing) | 古迹实体、名称、图片关联 | 结构化数据 CC0 |
| [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Copyrights) | 条目简介 | 按条目适用许可，通常为 CC BY-SA |
| [Wikimedia Commons](https://commons.wikimedia.org/) | 古迹图片 | 以每个文件的作者、署名与授权为准 |
| [ArcGIS World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) | 卫星与航拍影像 | 仅交流学习使用；适用 Esri 服务条款及影像供应者许可，公开网站使用授权尚待确认 |
| [OpenFreeMap](https://openfreemap.org/) | Liberty 矢量底图 | 遵循底图及其上游数据的署名要求 |
| [Nominatim](https://operations.osmfoundation.org/policies/nominatim/) | 地点搜索 | 遵循服务使用政策 |
| [DeepSeek](https://platform.deepseek.com/) | 可选翻译与联网资料整理 | 用户自备密钥，遵循服务条款 |

本项目是独立的地图探索工具，并非 Heritage Watch AI、Wikimedia 或其他数据提供者的官方产品。

## 数据局限与隐私

- 各国名录仅展示上游标记为开放（licence_class=open）的记录；不同名录的具体许可与署名须以原始记录为准。Pleiades 采用代表坐标，不代表遗址真实精确位置；老地图可能存在配准误差。不同历史年代的现代底图仅用于参照。
- 卫星影像仅供交流学习，非实时且不保证覆盖或可用性；用途说明不代替服务许可。
- 古迹数据不等于各国官方文物保护名录，可能存在遗漏、重复、名称或分类错误、位置偏差；受损／已毁图层还包含部分非古迹对象。
- 中文译名可能并非正式名称，AI 生成内容不能代替原始史料或专业考证。请通过原始条目、来源链接及相关历史资料交叉核查。
- 本项目不设账号系统。显示偏好、AI 译名缓存及可选的 DeepSeek API Key 保存在本机浏览器 localStorage 中，密钥未加密；不应在公共设备保存。
- 地图、地名、维基资料与 AI 查询会向相应第三方服务发出请求。定位需浏览器授权；位置用于地图居中，加载相应区域地图也会产生网络请求。
- 建议使用专用、低额度的 DeepSeek 密钥，并在不再使用时清除。

## 技术与本地运行

基于 HTML、CSS、JavaScript、[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) 与 [PMTiles](https://docs.protomaps.com/pmtiles/)，采用静态网页架构：`index.html` 负责地图及界面，`sources.js` 负责新增数据源和历史地图，`translate.js` 负责地图名称批量翻译，`list-search.js` 负责古迹列表普通搜索与 AI 匹配。无需自建后端服务。

```bash
git clone https://github.com/Fervpluvideus/world-heritage-map.git
cd world-heritage-map
python -m http.server 8000
```

浏览器访问 `http://localhost:8000/`。需要网络与支持 WebGL 的现代浏览器。浏览器定位功能还受安全上下文及权限限制。

## 反馈与贡献

欢迎通过 [Issues](https://github.com/Fervpluvideus/world-heritage-map/issues) 提交功能建议、错误反馈与数据纠错线索。涉及具体古迹时，建议附上位置、原始条目链接及可核查资料。

仓库源码公开可见；目前尚未设置独立的软件许可证。第三方数据和图片继续适用其各自的授权条款。

---

**历史不只存在于书页，也留在我们脚下的土地上。**
