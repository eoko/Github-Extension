'use strict';

function App() {

  return {
    init: init
  };

  function init() {
    initChromeMessageListener();
  }

  function initChromeMessageListener() {
    chrome.runtime.onMessage.addListener(function (msg) {
      console.log(msg);

      if (msg.name === 'do.i.use.this.repo') {
        checkRepositoryUsage(msg.url);
      }
      if (msg.name === 'i.want.to.use.this.repo') {
        addToRepositoryUsage(msg.url);
      }
      if (msg.name === 'i.dont.want.to.use.this.repo') {
        removeToRepositoryUsage(msg.url);
      }
    });
  }

  function removeToRepositoryUsage(url) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get("repositories", function (obj) {
        if (_.isArray(obj.repositories)) {
          var repositories = obj.repositories;
          var index = _.indexOf(repositories, url);

          if (index >= 0) {
            repositories.splice(index, 1);
          }
        }
        chrome.storage.sync.set({"repositories": repositories}, function (key) {
          checkRepositoryUsage(url);
          resolve(key);
        });
      });
    });
  }

  function addToRepositoryUsage(url) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get("repositories", function (obj) {
        var repositories = [url];
        if (_.isArray(obj.repositories)) {
          repositories = obj.repositories;
          if (_.indexOf(repositories, url) == -1) {
            repositories.push(url);
          }
        }
        chrome.storage.sync.set({"repositories": repositories}, function (key) {
          checkRepositoryUsage(url);
          resolve(key);
        });
      });
    });
  }

  function checkRepositoryUsage(url) {
    var name = 'i.dont.use.it';

    chrome.storage.sync.get("repositories", function (obj) {
      if (_.has(obj, 'repositories')) {
        if (_.indexOf(obj.repositories, url) >= 0) {
          name = 'i.use.it';
        }
      }
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {name: name, content: url});
      });
      chrome.browserAction.setBadgeText({text: obj.length});
    });
  }
}

App().init();