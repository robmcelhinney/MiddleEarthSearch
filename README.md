# MiddleEarthSearch | Search text from The Lord of the Rings
Viewable at [https://robmcelhinney.github.io/MiddleEarthSearch/](https://robmcelhinney.github.io/MiddleEarthSearch/)

Attempted to make this website so that it could solely be hosted by Github, no need to use an external database or any server side code, a static webpage only.

## Install

    $ git clone git@github.com:robmcelhinney/MiddleEarthSearch.git
    $ cd MiddleEarthSearch
    $ npm install

## Start & watch

    $ npm start

## Simple build for production

    $ npm run build

## Create json file that stores book data

Store any books in the books/ directory as .txt files. e.g. ["The-Fellowship-of-the-Ring.txt", "The-Twin-Towers.txt", "Return-of-the-King.txt"]

Python 3 must be installed.

    $ python convert-to-json.py

## Docker
View the docker branch of this repo.

## Future plans
* Store book data in sqlite database rather than in json but keep sqlite parsing limited to the client.

* Add tests.


## Acknowledgments
* Inspiration: [http://asearchoficeandfire.com/](http://asearchoficeandfire.com/)
* Already created: [https://github.com/robmcelhinney/A-Song-Of-Ice-And-Fire-Search](https://github.com/robmcelhinney/A-Song-Of-Ice-And-Fire-Search) made using PHP and a MySQL database.
