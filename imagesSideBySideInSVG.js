/*global $, jQuery, localStorage, window, angular, alert, document, console, confirm, require */
/*jshint unused:false */
/*jshint plusplus: false, devel: true, nomen: true, indent: 4, maxerr: 50 */

var iStart = new Date();

function makeCopyable(sText) {
	var ta = document.createElement("textarea");
	ta.id = "copyArea" + (new Date() - new Date(1964, 8, 23));
	ta.style.cssText = "width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 10000;";
	var cuttextarea = document.body.appendChild(ta);
	cuttextarea.className = "js-cuttextarea";
	cuttextarea.value = sText;
	cuttextarea.addEventListener('click', function cut(event) {
		var cutTextarea = document.querySelector('#' + ta.id);
		cutTextarea.select();
		try {
			var successful = document.execCommand('cut');
			var msg = successful ? 'successful' : 'unsuccessful';
			alert('Cutting text command was ' + msg);
		} catch (err) {
			alert('Oops, unable to cut');
		};
		document.body.removeChild(cuttextarea);
	});
	cuttextarea.focus();
}

function getUnique(arr, prop) {
	var u = {},
		a = [];
	for (var i = 0, l = arr.length; i < l; ++i) {
		if (u.hasOwnProperty(arr[i][prop])) {
			continue;
		}
		a.push(arr[i]);
		u[arr[i][prop]] = 1;
	}
	return a;
}

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
	sSVG = "<?xml version=\"1.0\" standalone=\"no\" ?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"SVGWIDTH\" height=\"SVGHEIGHT\" viewBox=\"0 0 SVGWIDTH SVGHEIGHT\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;\">";
var oTemp = [];
oTemp = document.querySelectorAll("img");
oImages = getUnique(oTemp, "src");

[].forEach.call(oImages, function (ele, i) {
	images.push(ele);
	var w = (ele.naturalWidth || ele.width),
		h = (ele.naturalHeight || ele.height);
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
addText(imageMargin, imageMargin + 30, "URL: " + document.location, "20px", document.location);
addText(imageMargin, imageMargin + 60, "Found " + oImages.length + " images", "20px");
addText(imageMargin, imageMargin + 80, "Done in " + (new Date() - iStart) + " ms", "12px");
addText(imageMargin + 100, imageMargin + 80, "Created using: https://github.com/netsi1964/snippets", "22px", "https://github.com/netsi1964/snippets");


function addText(x, y, text, fs, href) {
	fs = fs || "12px";
	var svgText = sText.replace("XX", x).replace("YY", y).replace("TEXT", text).replace("FS", fs);
	if (typeof href !== "undefined") {
		svgText = "<a xlink:href=\"" + href + "\" target=\"_blank\">" + svgText + "</a>";
	}
	sSVG += svgText;
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
	addText(imageMargin, yy + imageMargin + iTextOffsetY, "Height: " + foundHeight + "px (" + widths.length + ((widths.length > 1) ? " images" : " image") + ")");
	sSVG += sLine.replace("X1", 0).replace("Y1", yy).replace("Y2", yy);
	widths.map(function (ele) {
		xx += parseInt(eachWidth(ele, foundHeight, xx), 10) + imageMargin;
	});
	sSVG += "</g>";
	yy += parseInt(foundHeight, 10) + imageMargin;
}

makeCopyable(sSVG.replace("SVGHEIGHT", yy).replace(/SVGWIDTH/g, SVGWIDTH) + "</svg>");