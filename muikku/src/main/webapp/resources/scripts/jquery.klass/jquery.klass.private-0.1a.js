/*! jQuery klass private v0.2a - Jean-Louis Grall - MIT license - http://code.google.com/p/jquery-klass-plugin */

(function( $ ) {

var securedKlasses = [ undefined ],
	reverseArray = securedKlasses.reverse,	// Array.prototype.reverse
	reverse = function( array ) {
		return reverseArray.call( array );
	},
	//apply = reverse.apply,	// Function.apply
	_createPublicMethod = function( klassNb, originalMethod ) {	// Creates a public method that will call the private method.
		return [
			function() {
				return this._callPrivateProps.call( this, klassNb, originalMethod, arguments );
			},
			function( secureMethodId ) {	// Called if needed to secure the originalMethod
				var method = originalMethod;
				originalMethod = secureMethodId;
				return method;
			}
		];
	},
	overwrite = function( oldMethod, newMethod, extend_klass ) {
		newMethod._klass = ext_klass( oldMethod, extend_klass );
		return newMethod;
	};

var config = $.klass.config,
	set = config.set,
	old_set_init = set.init,
	ext_klass = set.ext_klass,
	klass_setups = [];
$.extend( true, config, {
	ext: { "private": true },
	filter: { _private: false },
	set: {
		init: function( _super, klass ) {
			var klass_setup = klass_setups[ klass_setups.length - 1 ],
				secured = klass_setup.sd,
				secure = klass_setup.s,
				originalInit,
				klassInfos;
			
			if ( klass_setup.i ) {
				originalInit = klass;
				klass = overwrite( originalInit, function() {
					
					if ( this.init === klass ) {
						var self = this,
							privateProps = [],
							i;
						for ( i in secured ) privateProps[i] = {};
						
						this._callPrivateProps = function( klassNb, originalMethod, args ) {
							if ( secured[ klassNb ] ) {
								originalMethod = securedKlasses[ secured[ klassNb ] ][ originalMethod ];
								//if ( originalMethod.apply !== apply ) $.error( "Security error: forbidden method call" );
							}
							
							var privateArgs = [ privateProps[ klassNb ] ], i;
							for ( i = args.length; i > 0; i-- ) privateArgs[i] = args[ i - 1 ];	// http://jsperf.com/small-array-concatenation
							return originalMethod.apply( self, privateArgs );	// Better than: apply.apply( originalMethod, [self, privateArgs] );
						};
					}
					
					originalInit.apply( this, arguments );
				}, { privateInit: true, privateSecure: secure });
				
				secured[ secured.length ] = secure && securedKlasses.length;
				if ( secure ) {
					klassInfos = [];
					klassInfos.klass = klass;
					securedKlasses[ securedKlasses.length ] = klassInfos;
				}
			}
			
			return klass = old_set_init( _super, klass );
		},
		privateInit: function( secure ) {
			var klass_setup = klass_setups[ klass_setups.length - 1 ];

			klass_setup.i = true;
			if( secure ) klass_setup.s = true;
		},
		_private: function( klass, dest, name, originalMethod ) {	// The klass may not have been made yet.
			var klass_setup = klass_setups[ klass_setups.length - 1 ],
				publicMethod;
			
			klass_setup.i = true;
			
			if( name === "_secure" && originalMethod === true ) {
				klass_setup.s = true;
				return;
			}
			
			publicMethod = _createPublicMethod( klass_setup.kis, originalMethod );
			klass_setup.msm[ klass_setup.msm.length ] = publicMethod[1];
			publicMethod = publicMethod[0];
			
			dest[ name ] = overwrite( originalMethod, publicMethod, { publicMethod: publicMethod } );
		}
	}
});

config.exec.unshift( function( options, makeKlass ) {
	var klass_setup = klass_setups[ klass_setups.length ] = {},
		_private = options._private,
		makeSecuredMethods = klass_setup.msm = [],
		secured = klass_setup.sd = [],
		klassInSecured,
		_super = options._super,
		len = securedKlasses.length,
		found,
		klass,
		i;
	
	if ( _super ) {
		if ( _super._klass.privateInit ) klass_setup.i = true;
		do {
			for ( found = false, i = len - 1; i > 0 && !found; i-- ) {
				if ( securedKlasses[i].klass === _super ) len = found = i;
			}
			secured[ secured.length ] = found;
		} while ( _super = _super._super );
		reverse( secured );
	}
	
	klassInSecured = klass_setup.kis = secured.length;	// klassInSecured
	
	set.each( klass, options.fields, "_private", _private );
	
	klass = makeKlass();	// Make the new class
	
	if ( secured[ klassInSecured ] ) {
		for ( i in makeSecuredMethods ) {
			securedKlasses[ secured[ klassInSecured ] ][i] = makeSecuredMethods[i]( i );
		}
	}
	
	klass_setups.pop();
} );

})( jQuery );