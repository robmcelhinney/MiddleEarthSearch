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
Store the trilogy of books in the books/ directory as .txt files as ["The-Fellowship-of-the-Ring.txt", "The-Twin-Towers.txt", "Return-of-the-King.txt"]

Python 3 must be installed.

    $ cd python
    $ python lotr-json.py

Then move the resulting MiddleEarth.json into the src/ directory.

## Docker
View at http://localhost/ (no need to specify a port).
Build & Run Development container

    $ docker build -t middledev .
    $ docker run --rm -dp 80:3000 --name middledev middledev


Build & Run Production container

    $ docker build --rm -f Dockerfile.prod -t middle-earth-prod .
    $ docker run --rm -dp 80:80 --name middle-earth middle-earth-prod

## Future plans
* Store book data in sqlite database rather than in json but keep sqlite parsing limited to the client.

* Add tests.


## Acknowledgments
* Inspiration: [http://asearchoficeandfire.com/](http://asearchoficeandfire.com/)
* Already created: [https://github.com/robmcelhinney/A-Song-Of-Ice-And-Fire-Search](https://github.com/robmcelhinney/A-Song-Of-Ice-And-Fire-Search) made using PHP and a MySQL database.
