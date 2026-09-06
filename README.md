# Diana Cursor Theme

[在线体验 Cursor 主题](https://diana-launcher-demo.szbluedream01.chatgpt.site/themes?app=cursor) · [启动器演示](https://diana-launcher-demo.szbluedream01.chatgpt.site/)

可切换日间、暗夜与原版参考，查看示例界面。网页不操作本机，演示效果不代表已完成真实挂载。

面向 Cursor 的嘉然（Diana）日间 / 暗夜双主题。

> **公开测试版：[`v0.1.0-beta.1`](https://github.com/lanmengSakura/diana-cursor-theme/releases/tag/v0.1.0-beta.1)。** GitHub Release 已提供只含原生颜色主题的 VSIX；完整美术仍是仓库蓝图，正式稳定版等待扩大真机回归。

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
| `__DIANA_NIGHT_PORTRAIT__` / `__DIANA_DAY_PORTRAIT__` | `assets/diana-night-v3.png` |
| `__DIANA_DOODLE__` | `assets/diana-doodle-chalk-v2-approved.png` |
| `__DIANA_STAR__` | `assets/diana-hand-star-reference-v2.png` |
| `__DIANA_CANDY__` | `assets/diana-candy-wrapped-v1.png` |
| `__DIANA_LOLLIPOP__` | `assets/diana-candy-lollipop-v1.png` |

这份蓝图本身不会自动挂载。已验证的本机加载器依赖版本识别、回环调试与本地状态，因此不进入公开仓库，也不能把“CSS 可审阅”写成“所有版本均可安全挂载”。

## 日间线稿修正（2026-09-06）

完整美术蓝图的左下简笔画改用原图透明轮廓着色为莓粉，解决浅底上粉笔线稿过淡的问题；夜间颜色、图案大小与位置不变。

已接入完整美术的本机加载器，需要同步实际加载的 CSS、文件校验清单及启动器认可的清单指纹，再重新挂载；仅更新网页演示或原生颜色 VSIX 不会更新这些装饰。不要跳过完整性校验。本仓库不包含机器专用加载器，现有 Beta VSIX 的内容和用途不变。

## 验证

```powershell
npm test
```

最后一轮验收范围见 [PRE_RELEASE.md](PRE_RELEASE.md)。代码使用 [MIT License](LICENSE)，角色与派生美术的边界见 [ASSET_LICENSES.md](ASSET_LICENSES.md)。本项目与 Cursor 官方无隶属或背书关系。
