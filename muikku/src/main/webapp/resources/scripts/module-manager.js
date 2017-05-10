(function(){
  var states = {};
  var readyCallback = null;

  function checkReadyState(){
    var allReady = Object.keys(states).every(function(src){
      return states[src] === 2;
    });
    if (allReady){
      states= {};
      readyCallback();
      readyCallback = null;
    }
  }

  /**
   * loads a css resource
   */
  function loadCss(src){
    states[src] = 2;

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = src;
    link.dataset.moduler = "true";

    checkReadyState();

    document.head.appendChild(link);
  }

  /**
   * Loads a javascript resource
   */
  function loadScript(src){
    states[src] = 1;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.dataset.moduler = "true";

    //Wheter it loads or fails, set the state to ready
    //And trigger the listeners
    script.onload = function(){
      states[src] = 2;
      checkReadyState();
    };
    script.onerror = script.onload;

    document.head.appendChild(script);
  }

  function scriptExistsInDom(src){
    return !!document.querySelector('script[src=' + JSON.stringify(src) + ']:not([data-moduler="true"])');
  }

  function cssExistsInDom(src){
    return !!document.querySelector('link[src=' + JSON.stringify(src) + ']:not([data-moduler="true"])');
  }

  /**
   * Loads a specific source and triggers a callback when it's loaded
   * or just triggers the callback if it's already loaded
   */
  function load(src){
    var isCss = (src.indexOf(".css", src.length - 4) !== -1);
    var existsInDom = (isCss ? cssExistsInDom : scriptExistsInDom)(src);

    if (states[src]){
      return;
    } else if (existsInDom){
      states[src] = 2;
      checkReadyState();
      return;
    }

    //try to load it
    if (isCss) {
      loadCss(src);
    } else {
      loadScript(src);
    }
  }

  /**
   * create a module, requeriments is an array
   */
  window.module = function(requeriments, callback){
    if (requeriments instanceof Function){
      requeriments();
      return;
    }
    requeriments.forEach(load);
    callback();
  }

  /**
   * wait until everything is loaded to trigger
   */
  window.loadModules = function(requeriments, callback){
    requeriments.forEach(load);
    readyCallback = callback;
  }
})();