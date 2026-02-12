from PIL import Image
import sys
import os

def crop_center_square(in_path, out_path, size=520):
    with Image.open(in_path) as im:
        w, h = im.size
        min_edge = min(w, h)
        left = (w - min_edge) // 2
        top = (h - min_edge) // 2
        right = left + min_edge
        bottom = top + min_edge
        cropped = im.crop((left, top, right, bottom)).resize((size, size), Image.LANCZOS)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        cropped.save(out_path, quality=90)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python crop_president.py <source-image-path> [output-path]')
        sys.exit(1)
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else 'dist/assets/images/president.jpg'
    crop_center_square(src, out)
    print(f'Saved cropped avatar to {out}')
