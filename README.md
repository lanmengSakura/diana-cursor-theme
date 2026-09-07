# Diana Cursor Theme

[在线体验 Cursor 主题](https://diana-launcher-demo.szbluedream01.chatgpt.site/themes?app=cursor) · [启动器演示](https://diana-launcher-demo.szbluedream01.chatgpt.site/)

可切换日间、暗夜与原版参考，查看示例界面。网页不操作本机，演示效果不代表已完成真实挂载。

面向 Cursor 的嘉然（Diana）日间 / 暗夜双主题。

> **公开测试版：[`v0.1.0-beta.2`](https://github.com/lanmengSakura/diana-cursor-theme/releases/tag/v0.1.0-beta.2)。** 除原生颜色 VSIX 外，新增 Cursor 3.17.21 专用的实验性完整美术运行包，并修复跟随系统时的明暗混用。不是全版本兼容承诺。

## 首次交付说明

使用前请看 [对应入口、依赖、恢复方式与测试范围](DELIVERY.md)。完整美术可使用新版多合一启动器，或下载本 Release 的 `diana-cursor-theme-0.1.0-beta.2-runtime.zip`；需要 Windows、Node.js 22+、Cursor 3.17.21 和单独风险确认。旧 VSIX 不会自动获得注入能力。

## 两层边界

### 可发布颜色主题

`themes/` 提供 `Diana Night` 与 `Diana Day`，负责侧栏、编辑器、终端、差异视图和语法颜色。它不修改 Cursor 安装目录，不读取账号状态，不开启调试端口，也不运行后台进程。

Beta VSIX 只包含颜色主题和必要元数据；`.vscodeignore` 会排除下方的实验美术蓝图。

### 仓库内视觉蓝图

`visual-blueprint/diana-cursor.css` 保留已经验证过的完整构图：顶部装饰线、左下简笔画、右侧立绘、星星、糖果、棒棒糖与日夜参数。CSS 中的 `__DIANA_*__` 是显式素材占位符，供实现者在受控加载器中替换：

| 占位符 | 仓库素材 |
|---|---|
| `__DIANA_CORNER__` | `assets/diana-left-top-detailed-corner-mask-v7.png` |
| `__DIANA_UPPER__` | `assets/diana-line-art-approved-upper.png` |
| `__DIANA_NIGHT_PORTRAIT__` / `__DIANA_DAY_PORTRAIT__` | `assets/diana-night-v3.png` / `assets/diana-corner-cutout-v2.png` |
| `__DIANA_DOODLE__` | `assets/diana-doodle-chalk-v2-approved.png` |
| `__DIANA_STAR__` | `assets/diana-hand-star-reference-v2.png` |
| `__DIANA_CANDY__` | `assets/diana-candy-wrapped-v1.png` |
| `__DIANA_LOLLIPOP__` | `assets/diana-candy-lollipop-v1.png` |

这份蓝图本身不会自动挂载。新增 `runtime/` 是独立的版本限定运行组件，必须显式同意风险；旧本机实验目录及其私人状态仍不分发，也不能把“CSS 可审阅”写成“所有版本均可安全挂载”。

## 日间线稿修正（2026-09-06）

完整美术蓝图的左下简笔画改用原图透明轮廓着色为莓粉，解决浅底上粉笔线稿过淡的问题；夜间颜色、图案大小与位置不变。

此修正已随 v3 完整运行组件交付；仅更新网页演示或原生颜色 VSIX 不会更新这些装饰。不要跳过完整性校验。本仓库不包含机器专用加载器或用户状态，原生颜色 VSIX 内容和用途不变。

## 跟随系统修正（2026-09-07）

v3 将用户请求的 system 与实际生效的 light/dark 分开，依据原生界面配色同步美术层，并在挂载成功条件中检查颜色一致性。Cursor 3.17.21 当前系统浅色、手动日夜、窄窗输入与撤下恢复已复验；扩大场景及不同版本仍需单独验证。

## 验证

```powershell
npm test
```

最后一轮验收范围见 [PRE_RELEASE.md](PRE_RELEASE.md)。代码使用 [MIT License](LICENSE)，角色与派生美术的边界见 [ASSET_LICENSES.md](ASSET_LICENSES.md)。本项目与 Cursor 官方无隶属或背书关系。
