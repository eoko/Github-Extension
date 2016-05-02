'use strict';

function App() {

  var $key = $('#key');
  var $save = $('#save');
  var $reset = $('#reset');
  var $name = $('#name');
  var $status = $('.status');

  return {
    init: init
  };

  function init() {
    $(function () {
      auth();
      attachDomListener();
    });
  }

  function attachDomListener() {
    $save.click(function (e) {
      e.preventDefault();
      login($key.val());
    });

    $reset.click(function (e) {
      e.preventDefault();
      logout();
    });
  }

  function auth() {
    chrome.storage.sync.get('github.key', function (obj) {
      if (typeof obj['github.key'] === 'string') {
        login(obj['github.key']);
      } else {
        hideLoading();
      }
    });
  }

  function login(key) {
    var github = new Octokat({token: key});
    showLoading();

    github.me.fetch()
      .then(function (githubUser) {
        return _.pick(githubUser, ['id', 'login', 'avatarUrl', 'bio', 'name']);
      })
      .then(function (user) {
        return new Promise(function (resolve, reject) {
          chrome.storage.sync.set({'github.user': user}, function () {
            chrome.storage.sync.set({'github.key': key}, function () {
              resolve(user);
            })
          });
        });
      }).then(function (user) {
        $name.html(user.name);
        $status.removeClass('disconnected');
        $status.addClass('connected');
        hideLoading();

      }).catch(function (err) {
        $('.flash-message p').html(JSON.parse(err.message).message);
        hideLoading();
      })
    ;
  }

  function logout() {
    chrome.storage.sync.set({'github.user': null}, function () {
      chrome.storage.sync.set({'github.key': null}, function () {
        $status.removeClass('connected');
        $status.addClass('disconnected');
        hideLoading();
      })
    });
  }

  function showLoading() {
    $('.loading').removeClass('hidden');
  }

  function hideLoading() {
    $('.loading').addClass('hidden');
  }
}

App().init();