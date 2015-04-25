/**
 * Will convert a AM|PM hour:minut string to a 24 hours string
 * @returns {String} A 24 hour ":" seperated string, f.i. 22:45
 */
String.prototype.to24hour = function () {
	function fixed(integer) {
		return ((parseInt(integer, 10) < 10) ? "0" : "") + integer;
	}
	var temp = this.split(":");
	if (temp.length !== 2) {
		return null;
	}
	var minutes = parseInt(temp[1].replace(/\D/g, ""), 10);
	temp[0] = parseInt(temp[0], 10);
	temp[0] += (temp[1].toUpperCase().indexOf("PM") > -1) ? 12 : 0;
	temp[1] = fixed(minutes);
	temp[0] = fixed(temp[0]);
	return temp.join(":");
};

/**
 * Will replace any AM|PM hour:minute times with 24 hours version
 * @returns {String} A string with hour:minute instead of AM|PM notation
 */
String.prototype.convertAMPMTo24hour24hour = function () {
	var result = this;
	if (!!result.match(RegExp.matchAMPM)) {
		result.match(reMatchAMPM).forEach(function (item) {
			result = result.replace(item, item.to24hour());
		});
	}
	return result;
};

// Usefull REGEX patterns
RegExp.prototype.matchAMPM = /(\d{2}:\d{2}[AP]M)/ig;