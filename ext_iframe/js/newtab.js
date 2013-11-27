function thumbnailsGotten(data) {
  var list = $('<ul>',{'class':"newtab_list"}).appendTo('.mostvisited');
  for(var i=0; i< data.length; i++){
    var href = data[i].url;
    var title = data[i].title;
    var favicon = 'chrome://favicon/' + data[i].url;
    console.log(href,title, favicon)
    var item = $('<div>',{'class':"newtab_list_item"}).appendTo(list);
    $('<img>',{src:favicon}).appendTo(item);
    $('<h3>').html(title).appendTo(item);
    $('<a>',{href:href}).html(href).appendTo(item);

  }

}

window.onload = function() {
  document.querySelector('.searchfield').value = '';
  chrome.topSites.get(thumbnailsGotten);
}