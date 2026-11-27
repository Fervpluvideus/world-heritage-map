# 🌏 世界古迹图 | World Heritage Map

**跨越语言的边界，探索人类文明的共同记忆。**

An interactive global map for exploring historical sites and cultural heritage across language barriers.

## 项目初衷

世界各地拥有数量庞大的历史建筑、文化遗产与考古遗址。然而，许多古迹的名称及相关资料主要以当地语言记录，尤其是知名度较低的地方性遗迹，往往缺乏其他语言的译名与介绍。这使得跨语言、跨地域的历史探索面临诸多障碍。

世界古迹图正是基于这一问题而创建。

本项目以开放地理数据为基础，整合 Heritage Watch AI、OpenStreetMap、Wikidata、Wikipedia 等数据与知识来源，通过多语言名称匹配、维基百科资料关联以及 DeepSeek API 翻译与联网检索，尽可能实现全球古迹信息的语言统一，同时保留原始名称、资料来源与相关链接，便于进一步查证与探索。

目前以简体中文作为主要展示语言，未来计划逐步支持更多语言，让不同语言背景的使用者都能够更加便捷地了解世界各地的历史与文化遗产。

本项目希望降低语言与信息壁垒，让历史探索不再局限于熟悉的国家、地区与文化。

**文明各有其语言，而人类共享其历史。**

[![版本](https://img.shields.io/badge/version-0.22-28594d)](https://github.com/Fervpluvideus/world-heritage-map)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线地图-28594d)](https://fervpluvideus.github.io/world-heritage-map/)
[![GitHub Issues](https://img.shields.io/github/issues/Fervpluvideus/world-heritage-map)](https://github.com/Fervpluvideus/world-heritage-map/issues)

## 在线使用 | Live Map

**[打开世界古迹图](https://fervpluvideus.github.io/world-heritage-map/)**

网站采用 GitHub Pages 托管。若账号更名后链接暂不可用，请以仓库 Settings → Pages 中显示的地址为准。

支持手机和电脑，无需安装、注册或下载地图。基本地图功能无需 API Key；AI 功能为可选项。

## 核心功能

- 🌍 **全球古迹探索**：直接加载 Heritage Watch AI 发布的全球 PMTiles 数据，随地图移动和缩放自动更新。
- 🏛️ **31 种古迹分类**：按类别、存续状态和遗产认定记录筛选，支持同类点位聚合及当前范围古迹列表。
- 🗺️ **古迹数据图层**：保留原有四个图层，增加开放各国遗产名录及边界、UNESCO 世界遗产、Pleiades 古代地名。
- 🕰️ **历史地图叠加**：OpenHistoricalMap 按年份显示有时间信息的道路和建筑；Allmaps 按当前地图中心查找已配准老地图，David Rumsey 可从关联馆藏或原站 XYZ 链接导入，提供独立的动画馆藏选择面板，支持透明度调整、覆盖范围定位、瓦片加载反馈及格式重试。原图授权须逐幅核查。
- 🔤 **中文优先与多语言**：优先展示可获得的中文名称，缺少中文时回退至英文或当地语言。
- 📷 **图片与历史简介**：优先读取图层关联图片及 Wikidata 图片，补充维基百科代表图片和简介，提供原始资料链接与图片授权信息。
- 🤖 **可选 DeepSeek 助手**：已有外文简介时直接翻译；缺乏资料时可联网搜索；维基百科加载期间也可主动开始联网查询。支持一键批量翻译当前视野内尚无中文名的遗址，每批30条、单次最多1000条；译名本地缓存，官方中文名优先，AI 译名保留原名并注明未核实。
- 📍 **地点搜索与定位**：支持城市和地点搜索；已授权的浏览器可自动定位，其他情况下默认显示沈阳。
- 📱 **移动端交互**：可收起菜单、带动画的详情面板、固定关闭按钮，自动记忆图层、分类和筛选设置。

## 如何使用

1. 打开地图，搜索城市或使用定位，缩放至感兴趣的区域。
2. 点击古迹图标或聚合点查看详情，也可通过「古迹列表」浏览当前范围内的记录。
3. 在「图层」和「古迹分类与图例」中按需要选择数据与类别。
4. 如需 AI 翻译或联网资料，在「AI 设置」中填写自己的 DeepSeek API Key 并选择可用模型。

地图加载、图片与简介检索依赖网络及第三方服务。DeepSeek API 请求可能产生费用，不配置密钥也能正常浏览地图。

5. 在「图层 → 历史地图叠加」中选择 OHM 年份，或查询附近的已配准老地图。Rumsey 可由原站 Use in GIS apps → XYZ link 导入。

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

- 新增各国名录仅展示上游标记为开放（licence_class=open）的记录；不同名录的具体许可与署名须以原始记录为准。Pleiades 采用代表坐标，不代表遗址真实精确位置；老地图可能存在配准误差。不同历史年代的现代底图仅用于参照。
- 古迹数据不等于各国官方文物保护名录，可能存在遗漏、重复、名称或分类错误、位置偏差；受损／已毁图层还包含部分非古迹对象。
- 中文译名可能并非正式名称，AI 生成内容不能代替原始史料或专业考证。请通过原始条目、来源链接及相关历史资料交叉核查。
- 本项目不设账号系统。显示偏好及可选的 DeepSeek API Key 保存在本机浏览器 localStorage 中，密钥未加密；不应在公共设备保存。
- 地图、地名、维基资料与 AI 查询会向相应第三方服务发出请求。定位需浏览器授权；位置用于地图居中，加载相应区域地图也会产生网络请求。
- 建议使用专用、低额度的 DeepSeek 密钥，并在不再使用时清除。

## 技术与本地运行

基于 HTML、CSS、JavaScript、[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) 与 [PMTiles](https://docs.protomaps.com/pmtiles/)，目前采用静态网页及独立图源模块，无需后端服务。

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
