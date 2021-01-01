# Luogu-Painter

## Usage

在洛谷「冬日绘版」中自动 Painting！

## Configuration

1. Clone 项目到本地。
2. `npm install`。
3. 使用 `scripts/loadPic.py` 生成图片的 `json` 格式，将其放到项目根目录下。
    - 需要安装 PIL 库：`pip install pillow`。
4. 复制 `config-example.json` 为 `config.json`，并配置以下内容：
    1. `picName`：生成好的图片 `json` 文件名。
    2. `x`,`y`：绘制时的坐标偏移量。
    3. `fetchTime`：更新地图的时间间隔，建议不要太小。（单位为 ms）
    4. `paintTime`：每个用户每次 paint 的时间间隔，建议比洛谷限制稍大。
    5. `users`：paint 所用的用户 `uid` 与 `client_id`，可添加多个。

## Thanks

- Luogu-Painter 使用的 `scripts/loadPic.py` 是 [AimonaStudio/luogu-drawer](https://github.com/AimonaStudio/luogu-drawer/blob/master/scripts/main.py) 里的脚本的修改版，非常感谢！
- 感谢为 Luogu-Painter 提供测试的 [ouuan/fake-luogu-paintboard-server](https://github.com/ouuan/fake-luogu-paintboard-server)！
