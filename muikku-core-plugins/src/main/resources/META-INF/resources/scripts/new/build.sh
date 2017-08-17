for FILE in index.frontpage.js index.js
	do browserify -o "dist/$FILE" -t [ babelify --presets [ env react ] --plugins [ transform-class-properties ] ] $FILE -d
done
