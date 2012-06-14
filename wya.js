// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
var vu = $.mobile.path.parseUrl( data.toPage );
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
//alert(data.toPage);
		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl( data.toPage );//,			re = /^#category-item/;
		if (u.hash == '#my-friends') {
			alert('friends page');
                }
		else if (u.hash == '#login') {
			alert('login page')
		}
//			e.preventDefault();
	}
});

//$( '#my-friends' ).live( 'pageinit',function(event,data){
$(document).bind( 'pageinit',function(event,data){
  alert( 'This page was just bind enhanced by jQuery Mobile!' );
});
$( document ).bind( "pagebeforeload", function( event, data ){
  alert( 'pagebeforeload');
});
$( document ).bind( 'pagebeforecreate',function(event){
  alert( 'This page was just inserted into the dom!' );
});
