/*global $, jQuery, localStorage, window, angular, alert, document, console, confirm, require */
/*jshint unused:false */
/*jshint plusplus: false, devel: true, nomen: true, indent: 4, maxerr: 50 */
var images = [],
	width = [],
	height = [],
	oImages,
	foundHeight, widths, sLog, iMinWidth = 100000,
	iMaxWidth = -1,
	iMinHeight = 100000,
	iMaxHeight = -1,
	heightLookup = {};
oImages = document.querySelectorAll("img");
[].forEach.call(oImages, function (ele, i) {
	images.push(ele.src);
	var w = ele.width,
		h = ele.height;
	if (w !== 0 || h !== 0) {

		width.push(w);
		height.push(h);
		if (typeof heightLookup[h] === "undefined") {
			heightLookup[h] = [];
		}
		heightLookup[h].push(i);
		iMinWidth = (w < iMinWidth) ? w : iMinWidth;
		iMaxWidth = (w > iMinWidth) ? w : iMaxWidth;
		iMinHeight = (h < iMinHeight) ? h : iMinHeight;
		iMaxHeight = (h > iMaxHeight) ? h : iMaxHeight;
	}
});
console.log("Found " + oImages.length + " images\n Sizes are: (" + iMinWidth + "-" + iMaxWidth + ", " + iMinHeight + "-" + iMaxHeight + ")");

function eachWidth(ele, height) {
	var src = images[ele];
	sLog += "<image xlink:href=\"" + src + "\" x=\"" + xx + "\" y=\"" + yy + "\" height=\"" + height + "px\" width=\"" + width[ele] + "px\"/>";
	return width[ele];
}
var yy = 0;
for (foundHeight in heightLookup) {
	var xx = 0;
	widths = heightLookup[foundHeight];
	widths.map(function (ele) {
		xx += parseInt(eachWidth(ele, foundHeight, xx), 10)
	});
	yy += parseInt(foundHeight, 10);
}
console.log(sLog);