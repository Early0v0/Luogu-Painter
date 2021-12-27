from PIL import Image
import json

imagePath = "./pic.png" 

# 文件地址，支持 .jpg 与 .png 格式。
# 在 png 格式下不会维护纯透明像素，且会取消所有像素的透明度。建议将图片二元透明化处理后采用此模式。

dataPath = '../pic.json' # 输出地址

# 缩放后像素大小
width = 48
height = 48

colors = {
    (0, 0, 0): 0,
    (255, 255, 255): 1,
    (170, 170, 170): 2,
    (85, 85, 85): 3,
    (254, 211, 199): 4,
    (255, 196, 206): 5,
    (250, 172, 142): 6,
    (255, 139, 131): 7,
    (244, 67, 54): 8,
    (233, 30, 99): 9,
    (226, 102, 158): 10,
    (156, 39, 176): 11,
    (103, 58, 183): 12,
    (63, 81, 181): 13,
    (0, 70, 112): 14,
    (5, 113, 151): 15,
    (33, 150, 243): 16,
    (0, 188, 212): 17,
    (59, 229, 219): 18,
    (151, 253, 220): 19,
    (22, 115, 0): 20,
    (55, 169, 60): 21,
    (137, 230, 66): 22,
    (215, 255, 7): 23,
    (255, 246, 209): 24,
    (248, 203, 140): 25,
    (255, 235, 59): 26,
    (255, 193, 7): 27,
    (255, 152, 0): 28,
    (255, 87, 34): 29,
    (184, 63, 39): 30,
    (121, 85, 72): 31,
}


def get_color(pixel):
    return min_color_diff(pixel, colors)[1]


def color_dist(c1, c2):
    return sum(abs(a - b) for a, b in zip(c1, c2))


def min_color_diff(color_to_match, colors):
    return min(
        (color_dist(color_to_match, test), colors[test])
        for test in colors)


def save(data):
    data = json.dumps(data)
    with open(dataPath, 'w+') as f:
        f.write(data)
    print("Finished.")


def main():
    im = Image.open(imagePath)
    im = im.resize((width, height))
    data = []
    w, h = im.size
    print("width", w, "height", h)

    for i in range(0, w, 1):
        for j in range(0, h, 1):
            if im.mode == 'RGBA' and im.getpixel((i, j)) == (0, 0, 0, 0): continue
            color = get_color(im.getpixel((i, j))[0:2])
            data.append({'x': i,'y': j,'color': color})
    save(data)


if __name__ == '__main__':
    main()
