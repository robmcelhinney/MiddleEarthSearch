import re
import json
import os
from os import listdir
from os.path import isfile, join
from pathlib import Path

def main():
    book_dir = "books"
    files = [f for f in listdir(book_dir) if isfile(join(book_dir, f))]
    
    data = {}
    for file_name in files:
        file_path = os.path.join(book_dir, file_name)
        add_file_to_json(file_path, data)
    write_to_json(data)


def add_file_to_json(filename, data):
    file_handle = open(filename, "r", encoding="utf8")

    book_name = Path(filename).stem

    lines = file_handle.read().splitlines()
    chapter_name = lines[0]
    para_num = 0
    chapter_num = 0
    paragraph = ""
    preline = ""

    book_data = []
    skip_next = False

    for i in range(len(lines[1:])):
        line = lines[i]

        # If the line is Chapter [NUM] then use the next (non-empty)
        # line as the chapter name.
        match_chapter = re.match(r'Chapter ([A-Za-z-]|[0-9])+$', line)
        if skip_next:
            skip_next = False
            continue
        if line and match_chapter:
            chapter_num += 1
            chapter_name = next_non_empty_line(i, lines)
            skip_next = True
        else:
            if not line.strip():
                if preline.strip():
                    paragraph = paragraph.replace('\n', '')
                    para_num += 1
                    # print("('{}', '{}', '{}', '{}', '{}')"
                    #       .format(book, book_num, chapter_num,
                    #               para_num, paragraph))
                    book_data.append({
                            'chapter_num': chapter_num,
                            'chapter_name': chapter_name,
                            'paragraph': paragraph,
                            'book_name': book_name})
                    paragraph = ""
            else:
                paragraph += line

            preline = line
    data[book_name] = book_data

def next_non_empty_line(i, lines):
    while i < len(lines) - 1:
        line = lines[i + 1]
        if line != "" and not line.isspace():
            return line.replace("'", "''")
        i += 1
    return ""

def write_to_json(data):
    with open('src/books.json', 'w') as file:
        json.dump(data, file)


if __name__ == '__main__':
    main()
