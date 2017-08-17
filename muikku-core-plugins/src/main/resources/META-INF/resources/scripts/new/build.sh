for FILE in index.frontpage.js index.js communicator.js
	do browserify -o "dist/$FILE" -x=react -x=redux -x=react-redux -x=react-dom -x=redux-thunk -t [ babelify --presets [ env react ] --plugins [ transform-class-properties ] ] $FILE -d
done
browserify -o dist/vendor.js -r react -r redux -r react-redux -r react-dom -r redux-thunk
