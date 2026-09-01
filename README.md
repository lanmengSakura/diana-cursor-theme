# Diana Cursor Theme

面向 Cursor 的嘉然（Diana）日间 / 暗夜双主题。

> **预发布状态：`0.1.0-rc.1`。** 可发布部分只使用 Cursor 兼容的 VS Code 颜色主题接口；最后一轮真机回归和 VSIX 内容审计通过后再创建正式 Release。

## 两层边界

### 可发布颜色主题

`themes/` 提供 `Diana Night` 与 `Diana Day`，负责侧栏、编辑器、终端、差异视图和语法颜色。它不修改 Cursor 安装目录，不读取账号状态，不开启调试端口，也不运行后台进程。

最终 VSIX 只包含颜色主题和必要元数据；`.vscodeignore` 会排除下方的实验美术蓝图。

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

## 验证

```powershell
npm test
```

最后一轮验收范围见 [PRE_RELEASE.md](PRE_RELEASE.md)。代码使用 [MIT License](LICENSE)，角色与派生美术的边界见 [ASSET_LICENSES.md](ASSET_LICENSES.md)。本项目与 Cursor 官方无隶属或背书关系。
