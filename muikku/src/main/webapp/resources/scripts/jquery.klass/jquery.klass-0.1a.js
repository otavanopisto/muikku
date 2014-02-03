/*! jQuery klass v0.1a - Jean-Louis Grall - MIT license - http://code.google.com/p/jquery-klass-plugin */

( function( $, undefined ) {

var

/* Configuration for extensions  */

	// config: Contains datas and hooks into the class creation process.
	// It is exposed as: $.klass.config (at the end)
	
	// config.ext: Contains names of loaded extensions.
	// Values can be true or if needed, an object containing datas accessible to other extensions.

	config = { ext: {} },
	
	// Parses the $.klass() arguments (extensions can change this function).
	parseArgs = config.parseArgs = function( options, args ) {
		options.fields = args.pop() || { };
		options._super = args.pop() || undefined;
		return options;
	},
	
	// Which properties must be filtered from the props. Values can be true or false or a string.
	// If true, automatically executes the function from config.set with the same name, passing to it each element of the property.
	// If a string, same as a true, but will use the string as the function name. Useful to make aliases.
	filter = config.filter = { _klass: true },
	
	// Functions that can be used to set properties during class creation
	// proto is klass.prototype, it cannot be omitted, but it can be undefined for some functions.
	set = config.set = {
		
		// 
		init: function( _super, klass ) {
			// Make the prototype's chain from klass to it's super class
			var proto = makeObjectPrototype( _super, klass );
			// Now we have: klass.prototype.[[prototype]] = _super.prototype
			
			set.field( klass, proto, "init", klass );
			
			return klass;
		},
		
		// Adds a static field to the class. Any kind of value is allowed.
		// proto can be undefined
		_klass: function( klass, proto, name, value ) {
			klass[ name ] = value;
		},
		
		ext_klass: function( method, extend_klass ) {
			return method._klass = $.extend(method._klass, extend_klass);
		},
		
		// Adds a field to the class. Any kind of value is allowed.
		field: function( klass, proto, name, value ) {
			// Each method keeps a reference to its name and its class
			// It allows us to find its super method dynamically at runtime.
			return $.isFunction( proto[ name ] = value ) && set.ext_klass( value, { klass: klass, name: name } );
		},
		
		// Calls a config.set function for each property of an object
		// Depending on funcName, proto can be undefined
		each: function( klass, proto, funcName, obj, options ) {
			for( var key in obj ) set[ funcName ]( klass, proto, key, obj[ key ] );
		}
	},
	
	// Functions executed around the class creation
	exec = config.exec = [ ],


/* Short reference */

	// Reference to Array.prototype.slice
	Array_slice = exec.slice,


/* $.klass */

	// Function: $.klass( [SuperKlass,] props )
	// Creates and returns a new class.
	// Usages:  MyKlass = $.klass( { init: function() { ... } } )
	// 			MyKlass = $.klass( SuperKlass, { } )
	// Arguments:
	// 		SuperKlass	(optional) The super class that the new class will extend.
	// 		props		Set of methods and other class properties.
	// Special props names:
	// 		init		The constructor. If omitted, an implicit init will be created.
	// 					Thus all classes have an init method.
	// 		_klass		Set of class methods (static methods). They will be added directly to the class.
	// Notes:
	// 	- $.klass is the implicit super class, not Object
	$klass = $.klass = function( /* [_super,] props */ ) {
		var
			
			// Contains all datas: fields, _super, _klass, and others used by the extensions
			options = config.parseArgs( { }, Array_slice.call( arguments ) ),
			
			// The super class (can be undefined)
			_super = options._super,
			
			// fields = props: contains the fields for the new class, plus others properties that will be filtered out soon
			fields = options.fields,
			
			// The klass, once it is made
			klass,
			
			// klass.prototype
			proto,
			
			// indexes in loops
			key,
			i = -1,
			setName,
			
			// Starts to execute all exec in order, then it makes the class, then it finishes all unfinished exec in reverse order.
			// Makes it easier to write extensions.
			makeKlass = function() {
				if( ++i < exec.length ) exec[i]( options, makeKlass );
				else {	// Now we make the class
					if(klass)console.log("klass already made !");
					
					// init is constructor and our future class
					// If no super class, use $.klass as implicit super class
					klass = fields.init = set.init( _super || $klass, fields.init );
					
					proto = klass.prototype;
					
					// Accessor for super klass ( is undefined if we use the implicit super class )
					klass._super = _super;
					
					// Adds all fields to the prototype of the klass
					set.each( klass, proto, "field", fields );
					
					// Automatically executes the config.set functions with the filtered elements
					// It only does so
					for( key in filter ) {
						if( filter[ key ] ) {
							setName = filter[ key ] === true ? key : filter[ key ];
							set.each( klass, proto, setName, options[ key ] );
						}
					}
				}
				while( i < exec.length ) makeKlass();
				return klass;
			};
		
		// Filter out relevant keys from the fields
		for( key in filter ) {
			if( fields[ key ] ) options[ key ] = fields[ key ];
			delete fields[ key ];
		}
		
		// If no init is provided, make one (Implicit constructor)
		if( !fields.init ) fields.init = function() {
			if( _super ) _super.prototype.init.apply( this, arguments );
		};
		
		// Executes all config.exec and makes the klass
		return makeKlass();
	},


/* Prototype chaining */

	protoChainingProxy = function() { },
	chainPrototype = $klass.chainPrototype = function( proto ) {
		// Use a proxy which does nothing (an empty function) to chain the prototype:
		protoChainingProxy.prototype = proto;
		
		// Make a new object whose [[prototype]] is the obj.prototype:
		return new protoChainingProxy();
		// Now we have: newObject.[[prototype]] = proto
	},
	makeObjectPrototype = $klass.makeObjectPrototype = function( baseObj, newObj ) {
		// Make the prototype of a new object, inheriting from baseObj:
		var proto = newObj.prototype = chainPrototype( baseObj.prototype );
		// Now we have: newObj.prototype.[[prototype]] = baseObj.prototype
		
		// Sets the constructor. So that all objects instanciated from newObj will be able to tell their constructor.
		// (But you shouldn't rely on the constructor which can be modified. Use instanceof instead.)
		proto.constructor = newObj;
		
		return proto;
	},


/* $.klass.prototype */

	// Properties assigned to it are directly available from any instance of the class or a subclass.
	$proto = config.proto = $klass.prototype;	// TODO: remove config.proto ?

// Function: this._super( [ methodName,] arguments, args... )
// Calls a super method. (Finding the super method dynamically.)
// Usages:  this._super( arguments, arg1, arg2, arg3, ... )
// 			this._super( "methodName", arguments, arg1, arg2, arg3, ... )
// Arguments:
// 		methodName	(optional) Name of the super method. Use this to call a super method with a different name than the current.
// 		arguments	You must give the arguments object here.
// 		args...		List of arguments for the super method.
$proto._super = function( arg1, arg2 ) {
	var arg1IsArguments = arg1.callee,
		_klass = ( arg1IsArguments ? arg1 : arg2 ).callee._klass,
		name = arg1IsArguments ? _klass.name : arg1,
		superMethod = _klass.klass._super.prototype[ name ];
	return superMethod.apply( this, Array_slice.call( arguments, 1 + ( !arg1IsArguments ) ) );
};

/*
$proto._super = function( arg0, arg1 ) {
	var name = !arg0.callee && arg0;
	arg0 = ( name ? arg1 : arg0 ).callee._klass;
	arg0 = name ? arg0.klass._super.prototype[ name ] : arg0._super;
	return arg0.apply( this, Array_slice.call( arguments, ( 1 + !!name ) ) );
};
*/

$klass.config = config;

})( jQuery );