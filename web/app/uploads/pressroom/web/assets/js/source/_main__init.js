fluidvids.init({
	selector: ['iframe', 'object'], 
	players: ['www.youtube.com', 'player.vimeo.com']
});

var ua = window.navigator.userAgent;

var str = "BakerFramework";
var n = ua.search(str);

/**
 * If we're not in Baker we'll load fonts from Google
 * To change the collection go to:
 * 
 * https://www.google.com/fonts#UsePlace:use/Collection:Lato|Playfair+Display:400,700,400italic|Cardo:400,700,400italic
 * 
 * Remember to edit families defined in fontfaceobserver.php accordingly
 */

if (n < 0) {
	WebFontConfig = {
	google: { families: [ 'Lato::latin', 'Playfair+Display:400,700,400italic:latin' ] },
	active: function() {
	}
	};
	(function() {
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	})();
} else {
	document.documentElement.className += " fonts-loaded";
}