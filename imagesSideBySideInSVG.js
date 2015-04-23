/*global $, jQuery, localStorage, window, angular, alert, document, console, confirm, require */
/*jshint unused:false */
/*jshint plusplus: false, devel: true, nomen: true, indent: 4, maxerr: 50 */
var images = [],
	width = [],
	height = [],
	oImages,
	foundHeight, widths, sSVG, iMinWidth = 100000,
	iMaxWidth = -1,
	iMinHeight = 100000,
	iMaxHeight = -1,
	heightLookup = {},
	maxWidth = 5000,
	leftMargin = 200,
	topMargin = 100,
	imageMargin = 5,
	sText = "<text x=\"XXpx\" y=\"YYpx\" style=\"font-family:Arial;font-size:FS;fill:#000;\">TEXT</text>",
	iTextOffsetY = 20,
	SVGWIDTH = -1,
	sLine = "<path d=\"m X1,Y1 L SVGWIDTH, Y2\" style=\"stroke:grey; stroke-width: 1px;stroke-dasharray:5,5;\" />",
	sSVG = "<?xml version=\"1.0\" standalone=\"no\" ?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"SVGWIDTH\" height=\"5000\" viewBox=\"0 0 SVGWIDTH 5000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;\">";
oImages = document.querySelectorAll("img");
[].forEach.call(oImages, function (ele, i) {
	console.log(getBase64URL(oImages[i]))
	images.push(ele);
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
addText(imageMargin, imageMargin + 30, "URL: " + document.location, "30px");
addText(imageMargin, imageMargin + 70, "Found " + oImages.length + " images", "30px");

function addText(x, y, text, fs) {
	fs = fs || "12px";
	sSVG += sText.replace("XX", x).replace("YY", y).replace("TEXT", text).replace("FS", fs);
}

function getBase64URL(img, outputFormat) {
	outputFormat = outputFormat || "image/jpeg";
	var img = new Image(),
		canvas = document.createElement('CANVAS'),
		ctx = canvas.getContext('2d'),
		dataURL;
	canvas.height = img.height;
	canvas.width = img.width;
	ctx.drawImage(img, 0, 0);
	dataURL = canvas.toDataURL(outputFormat);
	canvas = null;
	return dataURL;
}

function eachWidth(ele, height) {
	var src = images[ele].src;
	sSVG += "<image xlink:href=\"" + src + "\" x=\"" + xx + "\" y=\"" + yy + "\" height=\"" + height + "px\" width=\"" + width[ele] + "px\"/>";
	var xpos = xx + width[ele];
	SVGWIDTH = (SVGWIDTH < xpos) ? xpos : SVGWIDTH;
	return width[ele];
}
var yy = topMargin;
for (foundHeight in heightLookup) {
	var xx = leftMargin;
	widths = heightLookup[foundHeight];
	sSVG += "<g>";
	addText(imageMargin, yy + imageMargin + iTextOffsetY, "Height: " + foundHeight + "px (" + widths.length + ((widths.length>1) ? " images" : " image")+")");
	sSVG += sLine.replace("X1", 0).replace("Y1", yy).replace("Y2", yy);
	sLine
	widths.map(function (ele) {
		xx += parseInt(eachWidth(ele, foundHeight, xx), 10) + imageMargin;
	});
	sSVG += "</g>";
	yy += parseInt(foundHeight, 10) + imageMargin;
}
console.log(sSVG.replace("SVGHEIGHT", yy).replace(/SVGWIDTH/g, SVGWIDTH) + "</svg>");