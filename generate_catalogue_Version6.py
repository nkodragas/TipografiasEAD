import os
import json

# Path to the root of the cloned TipografiasEAD repo
BASE_DIR = "."

def is_font(file):
    return file.lower().endswith(('.otf', '.ttf'))

def is_specimen(file):
    return file.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg'))

catalogue = []

for year in os.listdir(BASE_DIR):
    if not year.isdigit():
        continue
    year_path = os.path.join(BASE_DIR, year)
    if not os.path.isdir(year_path):
        continue
    for author in os.listdir(year_path):
        author_path = os.path.join(year_path, author)
        if not os.path.isdir(author_path):
            continue
        entry = {"year": year, "author": author}
        fonts = []
        specimens = []
        for file in os.listdir(author_path):
            rel_path = os.path.join(year, author, file).replace("\\", "/")
            if is_font(file):
                fonts.append({
                    "file": rel_path,
                    "name": os.path.splitext(file)[0]
                })
            elif is_specimen(file):
                specimens.append(rel_path)
        if fonts:
            for font in fonts:
                font_entry = dict(entry)  # copy
                font_entry.update(font)
                if specimens:
                    font_entry["specimen"] = specimens if len(specimens) > 1 else specimens[0]
                catalogue.append(font_entry)
        elif specimens:
            specimen_entry = dict(entry)
            specimen_entry["specimen"] = specimens if len(specimens) > 1 else specimens[0]
            catalogue.append(specimen_entry)

with open("catalogue.js", "w", encoding="utf-8") as f:
    f.write("const fonts = ")
    json.dump(catalogue, f, ensure_ascii=False, indent=2)
    f.write(";\nexport default fonts;\n")
print("catalogue.js generated!")