# Cursor 首次交付说明

## 选择入口

- 只要配色：安装 Release 中 VSIX，在 Cursor 的 Color Theme 中选择 Diana Night / Diana Day。VSIX 不含运行中的立绘注入组件。
- 需要完整立绘：Beta.2 的 `runtime/` 为 Cursor **3.17.21** 的版本限定运行组件，由启动器 **0.1.0-beta.4-rc.2** 内置，也提供单独运行 ZIP。Beta.1 VSIX、启动器 Beta.3 不会自动获得这项补齐。

## 从候选源码构建

```powershell
npm test
npm run build:runtime
node .\dist\runtime\adapter.mjs self-test
```

分发时打包整个 `dist/runtime/`，不要只发 adapter.mjs。程序路径由新版启动器传入；自定义安装可设置 `DIANA_CURSOR_EXE`。无需让模型重新生成加载器或登记任意哈希。

手动启动命令和风险确认见 [运行包说明](runtime/README-LOCAL.txt) 与 [SECURITY.md](SECURITY.md)。需要 Windows、Node.js 22+；先保存工作并完整退出普通 Cursor。适配器不替用户杀进程，不更改安装资源。

## 恢复

运行中恢复先撤下美术，随后自行完全退出 Cursor，再运行一次恢复，以还原受管的用户配色设置，最后普通重开。只撤下美术不会关闭调试端口。已有旧本机适配器和恢复记录不会被新版候选静默覆盖，应先用旧入口完成恢复。

此前已有配置、注释、便携目录和挂载后用户新增的设置均保留；遇到同名但不同内容的扩展会拒绝覆盖。
## 本地候选包

在仓库根目录执行 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/pack-delivery.ps1`，在 `dist/` 生成独立候选 ZIP 和 SHA-256。Cursor/Grok 须先执行 `npm run build:runtime`；生成的 `runtime/` 必须整目录保留。打包器使用显式清单，并逐项比较压缩包与源文件字节，不包含应用本体、登录态或本机恢复记录。候选包不是已发布新版。

## 给用户或部署模型的共同要求

只从对应仓库 Release 获取发行包，保留目录结构并先核对 SHA-256。使用绝对安装路径，路径含空格时加引号。不要复制作者机器的路径、登录态、恢复记录或日志。

遇到版本、签名、SHA-256、程序路径或页面结构错误时停止，并提供目标版本和脱敏错误码；不要改哈希“让校验通过”、强杀整个进程树、替换应用可执行文件或擅自创建常驻任务。

文件存在、脚本退出码为零、演示页正常都不是实际挂载成功。v3 已在 Cursor 3.17.21 复验当前系统浅色、手动日夜、窄窗输入和撤下恢复；其余扩大场景见 PRE_RELEASE.md。现有 Release 资产不会因后续源码修改自动更新。
