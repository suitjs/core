cmd /c jsdoc ./js/suit.js -d docs/deploy/ -t docs/template/ -c docs/template/conf.json -r README.md
cmd /c uglifyjs js/suit.js -o js/suit.min.js
