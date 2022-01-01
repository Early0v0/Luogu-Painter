# Luogu-Painter

## Usage

在洛谷「冬日绘版」中自动 Painting！

## Configuration

1. Clone 项目到本地。
2. `npm install`。
3. 使用 `scripts/loadPic.py` 生成图片的 `json` 格式，将其放到项目 `pictures` 目录下。
    - 需要安装 PIL 库：`pip install pillow`。
4. 复制 `config-example.json` 为 `config.json`，并配置以下内容：
    1. `picFile`：生成好的图片，支持多张图同时绘制：
        - `name`：`json` 文件名。
        - `x`,`y`：绘制时的坐标偏移量。
    2. `fetchTime`：更新地图的时间间隔，建议不要太小。（单位为 ms）
    3. `paintTime`：每个用户每次 paint 的时间间隔，建议比洛谷限制稍大。（单位为 ms）
    4. `random`：如果为 `true`，则每次随机选择需要绘制的点进行绘制；否则按「图片编号为第一关键字、坐标顺序为第二关键字」排序然后绘制。
    5. `users`：绘制所用的用户 `token`，可添加多个。
5. `npm start`，开始你的创作！

## Thanks

- Luogu-Painter 使用的 `scripts/loadPic.py` 是 [AimonaStudio/luogu-drawer](https://github.com/AimonaStudio/luogu-drawer/blob/master/scripts/main.py) 里的脚本的修改版，非常感谢！
- 感谢为 Luogu-Painter 提供测试的 [ouuan/fake-luogu-paintboard-server](https://github.com/ouuan/fake-luogu-paintboard-server)！
