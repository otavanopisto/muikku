let fs = require('fs');
let browserify = require('browserify');
let envify = require('envify/custom');
let UglifyES = require("uglify-es");
let through = require('through');

console.log("Environment is", process.env.NODE_ENV || "development");
console.log("Developer tool integration set to", process.env.NODE_ENV !== "production");
let specificFile = process.argv[2];

const external = ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'prop-types', 'babel-polyfill'];
const ignores = ['redux-logger', 'redux-devtools-extension'];

function uglify(file){
  console.log("compressing", file);
  let data = '';
  return through(write, end);

  function write (buf) { data += buf }
  function end () {
    this.queue(UglifyES.minify(data, {
      compress: {
        dead_code: true,
        conditionals: true,
        unused: true
      }
    }).code);
    this.queue(null);
  }
}

function build(file){
  console.log("building", `${__dirname}/entries/${file}`);
  let b = browserify(`${__dirname}/entries/${file}`, {
    debug: process.env.NODE_ENV !== "production"
  });

  for (let exclude of external){
    b.exclude(exclude);
  }

  let plugins = ['transform-class-properties', 'babel-plugin-root-import', 'syntax-async-functions', 'transform-regenerator', "transform-runtime"];
  if (process.env.NODE_ENV === "production"){
    plugins.push('babel-plugin-transform-react-remove-prop-types');
  }
  b.transform('babelify', {
    presets: ['env', 'react'],
    plugins: plugins
  });
  b.transform(envify({
    NODE_ENV: process.env.NODE_ENV
  }));

  if (process.env.NODE_ENV === "production"){
    for (let ignore of ignores){
      b.ignore(ignore);
    }
    b.transform(uglify, {global: true});
  }

  let stream = fs.createWriteStream(`${__dirname}/../dist/${file}`);
  b.bundle().on('error', function(e){
    console.log(e.message);
    console.log(e.stack);
  }).pipe(stream);

  stream.on('finish', function () {
    console.log("Finished building of", `${__dirname}/../dist/${file}`);
  });
}

if (specificFile){
  build(specificFile);
} else {
  fs.readdir('./entries', function(err, filenames){
    if (err){
      console.error(err.stack);
      process.exit(1);
    }
  
    for (let file of filenames){
      build(file);
    }
  
    console.log("Building vendor file");
    let b = browserify();
    for (let requirement of external){
      b.require(requirement);
    }
    b.transform(envify({
      NODE_ENV: process.env.NODE_ENV
    }));
    if (process.env.NODE_ENV === "production"){
      b.transform(uglify, {global: true});
    }
    
    if (!fs.existsSync(`${__dirname}/../dist`)){
      fs.mkdirSync(`${__dirname}/../dist`);
    }
  
    let stream = fs.createWriteStream(`${__dirname}/../dist/vendor.js`);
    b.bundle().pipe(stream);
  
    stream.on('finish', function () {
      console.log("Finished vendor building at", `${__dirname}/../dist/vendor.js`);
    });
  })
}