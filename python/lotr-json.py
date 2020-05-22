import re
import json
import os
from os import listdir
from os.path import isfile, join

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

    if 'The-Fellowship-of-the-Ring.txt' in filename:
        book = 'TFOTR'
        book_num = 1
        book_name = 'The Fellowship of the Ring'
    elif 'The-Twin-Towers.txt' in filename:
        book = 'TTT'
        book_num = 2
        book_name = 'The Twin Towers'
    elif 'Return-of-the-King.txt' in filename:
        book = 'ROTK'
        book_num = 3
        book_name = 'Return of the King'
    else:
        return

    para_num = 0
    chapter_name = "Foreword"
    chapter_num = 0
    paragraph = ""
    preline = ""
    lines = file_handle.read().splitlines()

    book_data = []
    skip = False

    for i in range(len(lines)):
        line = lines[i]

        # If the line is Chapter [NUM] then use the next line as the
        # chapter name.
        match_chapter = re.match(r'Chapter .*[0-9].*', line)
        match_book = re.match(r'Book .*I.*', line)
        if match_book or skip:
            skip = False
            continue
        if line and match_chapter:
            chapter_num += 1
            next_line = lines[i + 1]
            next_line = next_line.replace("'", "''")
            chapter_name = next_line
            skip = True
        elif line == "Foreword":
            chapter_name = line
        else:
            next_line = ""
            if (i + 1 != len(lines)):
                next_line = lines[i + 1]
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
    data[book] = book_data


def write_to_json(data):
    with open('MiddleEarth.json', 'w') as outfile:
        json.dump(data, outfile)


if __name__ == '__main__':
    main()
