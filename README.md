# 🌏 世界古迹图 | World Heritage Map

**跨越语言的边界，探索人类文明的共同记忆。**

面向历史爱好者、旅行者与文化遗产探索者的全球交互式地图，融合古迹数据库、多语言知识检索、AI 翻译和历史地图叠加，让散落在世界各地的历史遗存更容易被发现、阅读与理解。

Explore the world's historical sites and cultural heritage through an interactive map, multilingual knowledge discovery, optional AI translation, and georeferenced historical maps.

[![版本](https://img.shields.io/badge/version-0.24-28594d)](https://github.com/Fervpluvideus/world-heritage-map)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线地图-28594d)](https://fervpluvideus.github.io/world-heritage-map/)
[![GitHub Issues](https://img.shields.io/github/issues/Fervpluvideus/world-heritage-map)](https://github.com/Fervpluvideus/world-heritage-map/issues)

## 在线使用 | Live Map

### [打开世界古迹图 →](https://fervpluvideus.github.io/world-heritage-map/)

支持手机与电脑浏览器，无需安装或注册。基础地图、古迹浏览、维基资料查询和历史地图叠加无需 API Key；DeepSeek AI 功能可按需配置。

## 项目初衷

世界各地的历史建筑、考古遗址与文化遗产，往往以当地语言命名和记录。尤其是知名度较低的地方性古迹，即使已经被收录于地理数据库，也可能缺少其他语言的译名与介绍。对于不熟悉当地语言的人而言，在地图上找到一处古迹，并不意味着能够理解它的历史。

世界古迹图正是为降低这一障碍而创建。

本项目整合 Heritage Watch AI、OpenStreetMap、Wikidata、Wikipedia、UNESCO 与 Pleiades 等数据与知识来源，将分散的遗产记录置于同一张交互式地图中。通过多语言名称匹配、维基百科资料关联，以及可选的 DeepSeek API 翻译和联网检索，尽可能统一古迹信息的展示语言，同时保留原始名称、数据来源和相关链接，方便进一步查证。

在此基础上，项目还引入 OpenHistoricalMap、Allmaps 与 David Rumsey 的历史地图资源，支持将现代地理空间与历史地图相互对照，探索历史遗存与城市空间的变迁。

目前以简体中文为主要展示语言，未来计划逐步支持更多语言。统一展示语言并非取代原始语言，而是让不同语言背景的人能够更加便捷地接近历史。

**文明各有其语言，而人类共享其历史。**

## 核心功能

### 01 · 全球古迹探索

- 接入全球 OSM 古迹、Wikidata 古迹、建筑轮廓、受损／已毁专题、各国开放遗产名录及其边界，以及 UNESCO 世界遗产、Pleiades 古代地名。
- 提供 31 种古迹分类，支持类别、存续状态与遗产认定记录筛选、同类点位聚合及当前范围古迹列表。
- 自动根据地图视野加载数据；图标冲突时优先显示有遗产认定记录或较完整资料的古迹。显示优先级不等于历史价值。
- 支持原始记录链接、维基百科简介及关联图片，并保留可获得的图片作者与授权信息。

### 02 · 跨语言历史探索

- 中文名称优先：利用原始数据、多语言字段及 Wikidata／Wikipedia 关联获取已有中文名；未获得中文名时保留英文或当地语言。
- 可选 DeepSeek 助手：支持翻译外文简介、按需联网检索，以及当前视野内古迹名称的批量翻译。
- 可开启随地图移动自动翻译，新进入视野的遗址名称分批更新，无需逐个点开详情。
- AI 译名本地缓存，保留原名并标注未核实；后续获得可靠中文名称时优先使用来源数据中的中文名。

### 03 · 历史地图与地理对照

- OpenHistoricalMap：按年份叠加具有时间信息的道路、建筑、水系等历史矢量要素。
- Allmaps：根据地图中心查找已配准的历史地图，支持覆盖范围定位、透明度调整及瓦片加载反馈。
- David Rumsey：支持 Allmaps 关联馆藏筛选，以及从原站导入可用的 XYZ 瓦片链接。并非整个馆藏都能直接叠加。
- 独立的馆藏选择面板，支持卡片展开、地图切换动画及格式重试。

### 04 · 移动端体验

- 城市与地点搜索、浏览器定位；无法自动定位时以沈阳为默认位置。
- 可收起的顶部菜单、动画详情面板及固定关闭按钮。
- 自动记忆古迹分类、图层、状态筛选及聚合等显示偏好。

## 使用指南

| 想做什么 | 操作方式 |
| --- | --- |
| 浏览古迹 | 搜索地点或移动地图，点击古迹图标或聚合点 |
| 寻找特定类型 | 展开图层及古迹分类菜单，选择所需类别 |
| 查看历史资料 | 打开详情，查看关联图片、维基百科简介或原始记录 |
| 翻译当前地图 | 在 AI 设置配置密钥与模型，然后点击「翻译当前地图名称」 |
| 持续中文化 | 开启「随地图移动自动翻译」，可随时通过顶部停止按钮关闭 |
| 查看历史矢量地图 | 图层 → 历史地图叠加 → OpenHistoricalMap，选择年份 |
| 叠加馆藏老地图 | 选择馆藏老地图 → 查找附近地图 → 核查原图授权 → 叠加到地图 |

## DeepSeek 使用与费用控制

AI 为可选功能，不影响基础地图使用。用户需自行提供 DeepSeek API Key 并选择可用模型。

| 项目 | 当前策略 |
| --- | --- |
| 手动批量翻译 | 每批 30 个名称，单次最多 1000 个名称 |
| 自动翻译 | 缩放等级 12 起，地图停稳约 0.5 秒后开始检查新名称 |
| 自动请求上限 | 每次开启最多请求 1000 个名称，含重试；刷新网页后默认关闭 |
| 失败处理 | 网络、限流与输出异常最多额外重试两次；密钥无效、余额不足等错误不反复请求 |
| 缓存 | 最多保存 6000 条 AI 译名，已缓存或已有中文名称的记录不重复翻译 |
| 停止 | 翻译期间顶部提供停止按钮；终止后续请求，但已经提交的请求仍可能产生费用 |

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
| [OpenFreeMap](https://openfreemap.org/) | Liberty 矢量底图 | 遵循底图及其上游数据的署名要求 |
| [Nominatim](https://operations.osmfoundation.org/policies/nominatim/) | 地点搜索 | 遵循服务使用政策 |
| [DeepSeek](https://platform.deepseek.com/) | 可选翻译与联网资料整理 | 用户自备密钥，遵循服务条款 |

本项目是独立的地图探索工具，并非 Heritage Watch AI、Wikimedia 或其他数据提供者的官方产品。

## 数据局限与隐私

- 各国名录仅展示上游标记为开放（licence_class=open）的记录；不同名录的具体许可与署名须以原始记录为准。Pleiades 采用代表坐标，不代表遗址真实精确位置；老地图可能存在配准误差。不同历史年代的现代底图仅用于参照。
- 古迹数据不等于各国官方文物保护名录，可能存在遗漏、重复、名称或分类错误、位置偏差；受损／已毁图层还包含部分非古迹对象。
- 中文译名可能并非正式名称，AI 生成内容不能代替原始史料或专业考证。请通过原始条目、来源链接及相关历史资料交叉核查。
- 本项目不设账号系统。显示偏好、AI 译名缓存及可选的 DeepSeek API Key 保存在本机浏览器 localStorage 中，密钥未加密；不应在公共设备保存。
- 地图、地名、维基资料与 AI 查询会向相应第三方服务发出请求。定位需浏览器授权；位置用于地图居中，加载相应区域地图也会产生网络请求。
- 建议使用专用、低额度的 DeepSeek 密钥，并在不再使用时清除。

## 技术与本地运行

基于 HTML、CSS、JavaScript、[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) 与 [PMTiles](https://docs.protomaps.com/pmtiles/)，采用静态网页架构：`index.html` 负责地图及界面，`sources.js` 负责新增数据源和历史地图，`translate.js` 负责地图名称批量翻译。无需自建后端服务。

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
