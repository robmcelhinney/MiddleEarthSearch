import os
from pathlib import Path
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import argparse

blacklist = ['[document]', 'noscript', 'header', 'html', 'meta', 'head', 'input', 'script']

def main():
    parser = argparse.ArgumentParser(description='Convert epub to txt',
            formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('-f', '--files', action='append', help='epub file')
    parser.add_argument('-s', '--src', action='store', help='Source location')
    parser.add_argument('-d', '--dest', action='store',  help='Destination location')
    args = parser.parse_args()

    files = args.files
    if files == None:
        print('Must provide file')
        quit()
    src = args.src
    if src == None:
        src = ''
    dest = args.dest
    if dest == None:
        dest = '.'

    for file_name in args.files:
        file_path = os.path.join(src, file_name)
        add_file_to_json(file_path, dest)

def add_file_to_json(filename, dest):
    book = epub.read_epub(filename)
    book_name = Path(filename).stem

    output_path = os.path.join(dest, book_name +'.txt')

    with open(output_path, 'w+', encoding='utf-8') as f:
        chapters = []
        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                chapters.append(item.get_content())

        for chapter in chapters:
            text = chapter_to_text(chapter)
            f.write(text+'\n')

def chapter_to_text(chap):
    output = ''
    soup = BeautifulSoup(chap, 'html.parser')
    text = soup.find_all(text=True)
    prev = ''
    for t in text:
        if t.parent.name not in blacklist:
            if not t.isspace():
                if not (str(prev).endswith(' ') or str(t).startswith(' ')):
                    output += '\n\n'
                output += '{}'.format(t)
            prev = t
    return output

if __name__ == '__main__':
    main()
