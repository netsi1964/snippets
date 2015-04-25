String.prototype.to24hour = function() {
  function fixed(integer) {
    return ((parseInt(integer,10)<10) ? "0" : "") + integer;
  };
  var temp = this.split(":");
  if (temp.length!==2) return null;
  var minutes = parseInt(temp[1].replace(/\D/g, ""),10);
  temp[0] = parseInt(temp[0], 10);
  temp[0]+=(temp[1].toUpperCase().indexOf("PM")>-1) ? 12 : 0;
  temp[1] = fixed(minutes);
  temp[0] = fixed(temp[0]);
  return temp.join(":");
}
