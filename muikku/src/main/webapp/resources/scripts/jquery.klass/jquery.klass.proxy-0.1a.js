/*! jQuery klass proxy plugin v0.1a - Jean-Louis Grall - MIT license - http://code.google.com/p/jquery-tinyklass-plugin */

(function( $ ) {

// Function: this._proxy( methodName || method )
// Returns a new function that has bound the "this" to the method.
// Usages:  obj._proxy( "methodName" )
// 			obj._proxy( obj.methodName )
// Arguments:
// 		methodName	The name of the method as a string, or a reference to the method itself.
// See jQuery.proxy(): http://api.jquery.com/jQuery.proxy/
$.klass.prototype._proxy = function( methodName ) {
	var method = ( typeof methodName === "string" ) ? this[ methodName ] : methodName;
	return $.proxy( method, this );
};

})( jQuery );