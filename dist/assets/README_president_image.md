Place the president avatar image at the path `dist/assets/images/president.jpg`.

Recommended workflow (on your machine):

1. Save the attached full-size photo to the repository, e.g. `tools/president_source.jpg`.
2. Install Pillow if you don't have it:

```bash
pip install pillow
```

3. Run the crop script to generate a circular 400x400 avatar used by the site:

```bash
python tools/crop_president.py tools/president_source.jpg dist/assets/images/president.jpg
```

4. Open `dist/index.html` to verify the President box shows the new image.

Notes:
- The site expects the image at `dist/assets/images/president.jpg` (relative to `dist/index.html`).
- The script crops a center square, resizes to 400x400 and saves as JPEG.
