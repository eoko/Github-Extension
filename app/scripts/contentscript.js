'use strict';

function App() {
  var url = $('h1.entry-title > strong > a').attr('href');
  var status = 'delete';
  var $btn = $("<li class='iuseit'><a class='btn btn-sm'>Loading</a></li>");

  $('.repohead ul.pagehead-actions').prepend($btn);

  $btn.click(function () {
    if (status == 'delete') {
      sendMessage('i.dont.want.to.use.this.repo', url);
    } else {
      sendMessage('i.want.to.use.this.repo', url);
    }
  });

  return {
    init: init
  };

  function init() {
    initChromeMessageListener();
    sendMessage('do.i.use.this.repo', url);
  }

  function yes() {
    var $a = $btn.find('a');
    status = 'delete';
    $a.html('Remove to Dev Stack');
  }

  function nop() {
    var $a = $btn.find('a');
    status = 'add';
    $a.html('Add to Dev Stack');
  }

  function sendMessage(name, url) {
    chrome.runtime.sendMessage({
      'name': name,
      'url': url
    })
  }

  function initChromeMessageListener() {
    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg.name == 'i.use.it') {
        yes();
      } else if (msg.name == 'i.dont.use.it') {
        nop();
      }
    });
  }
}

App().init();