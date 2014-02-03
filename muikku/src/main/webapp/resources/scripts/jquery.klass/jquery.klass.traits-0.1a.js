/*! jQuery klass traits v0.2a - Jean-Louis Grall - MIT license - http://code.google.com/p/jquery-klass-plugin */

(function( $ ) {

var $error = $.error,
	$inArray = $.inArray,
	$klass = $.klass,
	$proto = $klass.prototype;

var $trait = $.trait = function( newFunctions ) {	// For ease of use, create the trait object. Equivalent to: return new Trait(args...)
		return new Trait( newFunctions );
	},
	Trait = $trait.Trait = $klass({	// Actually every trait is an object instantiated from this klass
		init: function( newFunctions ) {
			var traitFunctions = this.functions = {},
				_private = newFunctions._private,
				privateFunctions,
				name;
			
			if ( _private ) {
				privateFunctions = this.privateFunctions = {};
				for ( name in _private ) {
					traitFunctions[ name ] = _private[ name ];
					privateFunctions[ name ] = true;
				}
			}
			
			for ( name in newFunctions ) {
				if ( name !== "_private" ) traitFunctions[ name ] = newFunctions[ name ];
			}
		}
	}),
	// Not used for now:
	_getTraitFn = function( method ) {	// If method is a trait method, return the wrapped method. Else return the method.
		return method._klass && method._klass.traitFn ? method._klass.traitFn : method;
	},
	_createTraitMethod = function( traitFn ) {	// A trait method is a wrapper function around the original function.
		var func = function() {	// Important: the returned function must work even if called recursively on different objects
			// When the original method is called, simply change it's _klass data, such that it believes that it is a method of another klass.
			var temp = traitFn._klass;
			traitFn._klass = func._klass;
			var result = traitFn.apply( this, arguments );
			traitFn._klass = temp;
			return result;
		};
		return func;
	};

var config = $.klass.config,
	set = config.set;
$.extend( true, config, {
	ext: { "traits": true },
	filter: { _traits: "trait" },
	set: {
		trait: function( klass, proto, name, trait ) {	// Here name is irrelevant (probably an index in an array)
			var traitFunctions = trait.functions,
				traitFunction,
				newMethod,
				oldMethod_klass,
				conflicting;
			
			klass._klass.traits.push( trait );
			
			for ( name in traitFunctions ) {
				traitFunction = traitFunctions[ name ];
				newMethod = _createTraitMethod( traitFunction );
				if ( proto.hasOwnProperty( name ) ) {
					oldMethod_klass = proto[ name ]._klass;
					if ( oldMethod_klass.trait ) $error( 'Method name conflict: ' + name );
					
					conflicting = oldMethod_klass.conflicting;
					if ( !conflicting ) conflicting = oldMethod_klass.conflicting = { traits: [], methods: [] };
					conflicting.traits.push( trait );
					conflicting.methods.push( newMethod );
				}
				else {
					set.ext_klass( newMethod, { trait: trait, traitFn: traitFunction } );
					set.field( klass, proto, name, newMethod );
				}
			}
		}
	}
});

config.exec.push( function( options, makeKlass ) {
	set.ext_klass( options.fields.init, { traits: [] } );
} );


$proto._trait = function( arg1, arg2, trait ) {
	var arg1IsArguments = arg1.callee,
		method = ( arg1IsArguments ? arg1.callee : arg2.callee._klass.klass.prototype[ arg1 ] ),
		conflicting = method._klass.conflicting,
		conflictingMethod = conflicting.methods[ $inArray( (arg1IsArguments ? arg2 : trait), conflicting.traits ) ];
	return conflictingMethod.apply( this, Array.prototype.slice.call( arguments, (arg1IsArguments ? 2 : 3) ) );
};

// Like an instanceof but for traits. Let you know if an object implements a particular trait.
// Searches recursively the parent classes until it find a klass that implements the trait, and then return that klass, or null if not found.
$proto._hasTrait = function( trait ) {	// Returns the closest class with the trait
	var klass = this.init,
		traits;
	do traits = klass._klass.traits;
	while ( ($inArray( trait, traits ) === -1 ) && ( klass = klass._super ) );
	return klass;
};

})( jQuery );