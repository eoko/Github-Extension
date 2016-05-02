'use strict';

chrome.storage.sync.get("repositories", function(obj) {
  $('.repos-list').empty();

  if(typeof obj.repositories == 'object') {
    obj.repositories.forEach(function(item) {
      $('.repos-list').append('<li>'+ item + '</li>');
    })
  }
});