var Reflux = require('reflux');
var Mopidy = require('mopidy');
var actions = require('./actions');

var settingsKey = 'moped:settings';

var settingsStore = Reflux.createStore({
  init: function () {
    this.listenToMany(actions);
  },
  onVerifyMopidyUrl: function (mopidyUrl) {
    var mopidy = new Mopidy({ 
      autoConnect: false,
      webSocketUrl: mopidyUrl
    });
    mopidy.on(console.log.bind(console));
    mopidy.on('state:online', function() {
      window.alert('Connection successful.');
    });
    mopidy.on('websocket:error', function(error) {
      window.alert('Unable to connect to Mopidy server. Check if the url is correct.');
    });

    mopidy.connect();

    setTimeout(function() {
      mopidy.close();
      mopidy.off();
      mopidy = null;
      console.log('Mopidy closed.');
    }, 1000);
  },
  onSave: function (settings) {
    window.localStorage[settingsKey] = JSON.stringify(settings);
    window.alert('Settings saved');
    this.trigger(settings);
  },
  getInitialState: function () {
    if (window.localStorage[settingsKey]) {
      return JSON.parse(window.localStorage[settingsKey]);
    }
    else{
      return { mopidyUrl: '' };
    }
  }
});

module.exports = settingsStore;