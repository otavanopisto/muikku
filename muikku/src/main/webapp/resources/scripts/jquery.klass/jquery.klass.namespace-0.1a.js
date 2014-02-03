/*! jQuery klass namespace plugin v0.1a - Jean-Louis Grall - MIT license - http://code.google.com/p/jquery-tinyklass-plugin */

(function( $, window, undefined ) {

var $klass_orig = $.klass,	// Keep a reference to the original $.klass
	pathSeparator = '.',
	isString = function( obj ) {
		return $.type( obj ) === "string";
	},
	splitLast = function( text ) {
		var sep = text.lastIndexOf(pathSeparator);
		return [ text.substring( 0, sep ), text.substring( sep + 1 ) ];
	},
	Scope = $klass_orig({
		_klass: {
			make: function( obj ) {
				if( !( obj instanceof Scope ) ) {
					if( obj._scope  instanceof Scope ) obj = obj._scope;
					else obj = new Scope( obj );
				}
				return obj;
			}
		},
		init: function( object ) {
			this.object = object;
			this.namespaces = { "": object };
			object._scope = this;
		},
		add: function( klassPath, klass ) {
			this.getNamespace( klassPath.namespaceName, true )[ klassPath.klassName ] = klass;
			klass.klassPath = klassPath;
			klassPath.get();
		},
		get: function( fullKlassName ) {
			var parts = splitLast( fullKlassName ),
				namespace = this.getNamespace( parts[0] );
			return namespace && namespace[ parts[1] ];
		},
		getNamespace: function( namespaceName, create ) {
			var namespaces = this.namespaces,
				namespace = namespaces[ namespaceName ];
			if( !namespace ) {
				var names = namespaceName.split( pathSeparator ),
					i,
					namesLength = names.length,
					curr = this.object;
				for( i = 0; i < namesLength; i++) {
					if( !curr[ names[i] ] ) break;
					curr = curr[ names[i] ];
				}
				if( i < namesLength && create ) {
					for( ; i < namesLength; i++ ) curr = curr[ names[i] ] = curr[ names[i] ] || { };
				}
				if( i === namesLength ) namespace = namespaces[ namespaceName ] = curr;
			}
			return namespace;
		}
	}),
	KlassPath = $klass_orig({
		_klass: {
			make: function( scope, fullKlassName ) {
				if( !fullKlassName ) {
					fullKlassName = scope;
					scope = defaultScope;
				}
				scope = Scope.make( scope );
				var parts = splitLast( fullKlassName ),
					namespaceName = parts[0],
					klassName = parts[1],
					namespace = scope.getNamespace( namespaceName ),
					klass = namespace ? namespace[ klassName ] : undefined;
				return klass && klass.klassPath ? klass.klassPath : new KlassPath( scope, namespace, namespaceName, klass, fullKlassName, klassName);
			}
		},
		init: function( scope, namespace, namespaceName, klass, fullKlassName, klassName ) {
			this.scope = scope;
			this.namespace = namespace;
			this.namespaceName = namespaceName;
			this.fullKlassName = fullKlassName;
			this.klassName = klassName;
		},
		get: function() {
			var namespace = this.namespace;
			if( !namespace ) this.namespace = namespace = this.scope.getNamespace( this.namespaceName );
			return namespace && namespace[ this.klassName ];
		}
	}),
	KlassPath_make = $.klassPath = KlassPath.make,
	Scope_make = KlassPath_make.scope = Scope.make,
	defaultScope = Scope_make.defaultScope = window;

var config = $.klass.config,
	old_parseArgs = config.parseArgs,
	set = config.set;
$.extend( true, config, {
	ext: { "namespace": true },
	parseArgs: function( options, args ) {
		var klass, i;
		for( i = 0; i < args.length - 1; i++ ) {
			if( $.isFunction( args[i] ) && args[i]._klass && args[i]._klass.klass === args[i] ) continue;	// TODO: find a better test to know that it is not an instance ?
			else if( isString( args[i] ) ) args[i] = KlassPath_make( args[i] );
			else if( !( args[i] instanceof KlassPath) && isString( args[i+1] ) ) {
				args.splice( i, 2, KlassPath_make( args[i], args[i+1] ) );
			}
			if( args[i] instanceof KlassPath ) {
				klass = args[i].get();
				if( klass ) args[i] = klass;	// If the klass exists, it is the parent
				else {
					options.klassPath = args[i];
					args.splice( i, 1 );
					i--;
				}
			}
		}
		return old_parseArgs( options, args );
	},
	set: {
		klassPath: function( klass, klassPath ) {
			klassPath.scope.add( klassPath, klass );
		}
	}
} );
config.exec.push( function( options, makeKlass ) {
	var klass = makeKlass();
	if( options.klassPath ) set.klassPath( klass, options.klassPath );
} );

})( jQuery, window );