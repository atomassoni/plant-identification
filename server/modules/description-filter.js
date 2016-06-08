

function cutDescription(text){
  var longDescription = text;
  var shortenedDescription = longDescription.substr(0,100);
  return shortenedDescription;
}

module.exports = cutDescription;
