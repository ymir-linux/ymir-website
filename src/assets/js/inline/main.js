var firstAnchor = '#home';
var currentHash = firstAnchor;

function updateHash() {
	//console.log('currentHash:'+currentHash);
	if (currentHash == firstAnchor) {
		$('#nav').addClass('scroll-top');
	} else {
		$('#nav').removeClass('scroll-top');
	}
}

$('body').onePageNav({
	navItems: 'a.op-nav',
	currentClass: 'current',
	changeHash: true,
	scrollSpeed: 750,
	scrollThreshold: 0.5,
	filter: '',
	easing: 'swing',
	scrollChange: function(currentListItem) {
		//// Change location bar url depending on the section scrolled to ////
		// Get the current section hash
		currentHash = currentListItem.find('a.op-nav').attr('href');
		if ( currentHash && currentHash != window.location.hash ) {
			if (window.history.pushState) {
				// Update the address bar location without scrolling
				window.history.pushState({}, '', currentHash);
			} else {
				// Fallback for browsers without pushState support
				window.location.hash = currentHash;
			}
			updateHash();
		}
	}
});
// Handle URL entering from browser
if (window.location.hash) {
	$('#nav').find('a[href$="' + window.location.hash + '"]').click();
	currentHash = window.location.hash;
	updateHash();
}

//$(document).ready(function() {
	$(document).on('click', 'a.op-nav', function() {
		currentHash = $(this).attr('href');
		updateHash();
	});
//});

// SVG supported
if ( document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ) {
	$('.logo.svg').show();
	$('.logo.png').hide();
}