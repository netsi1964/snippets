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
	heightLookup = {},
	maxWidth = 5000,
	leftMargin = 200,
	imageMargin = 5,
	sText = "<text x=\"XXpx\" y=\"YYpx\" style=\"font-family:Arial;font-size:12px;fill:#000;\">HEIGHT px</text>",
	iTextOffsetY = 20,
	sLine = "<path d=\"m X1,Y1 L X2, Y2\" style=\"stroke:grey; stroke-width: 1px;stroke-dasharray:5,5;\" />",
	sLog = "<?xml version=\"1.0\" standalone=\"no\" ?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"" + maxWidth + "\" height=\"5000\" viewBox=\"0 0 " + maxWidth + " 5000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;\">";
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
	var xx = leftMargin;
	widths = heightLookup[foundHeight];
	sLog += "<g>";
	sLog += sText.replace("XX", imageMargin).replace("YY", yy + imageMargin + iTextOffsetY).replace("HEIGHT", foundHeight);
	sLog += sLine.replace("X1", 0).replace("Y1", yy).replace("X2", maxWidth).replace("Y2", yy);
	sLine
	widths.map(function (ele) {
		xx += parseInt(eachWidth(ele, foundHeight, xx), 10) + imageMargin;
	});
	sLog += "</g>";
	yy += parseInt(foundHeight, 10) + imageMargin;
}
console.log(sLog + "</svg>");