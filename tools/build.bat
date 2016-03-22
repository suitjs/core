cmd /c jsdoc ./js/suit.doc.js -d docs/deploy/ -t docs/template/ -c docs/template/conf.json -r README.md
cmd /c uglifyjs js/suit.doc.js -b -o js/suit.js
cmd /c uglifyjs js/suit.doc.js -o js/suit.min.js
