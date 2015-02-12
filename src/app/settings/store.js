var Reflux = require('reflux');
var Mopidy = require('mopidy');
var SettingsActions = require('./actions');

var settingsKey = 'moped:settings';

var settingsStore = Reflux.createStore({
  init: function () {
    this.listenToMany(SettingsActions);
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
      console.log(error);
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
    this.settings = settings;
    window.localStorage[settingsKey] = JSON.stringify(this.settings);
    window.alert('Settings saved');
    this.trigger(this.settings);
  },
  getInitialState: function () {
    if (window.localStorage[settingsKey]) {
      this.settings = JSON.parse(window.localStorage[settingsKey]);
    }
    else{
      this.settings = { mopidyUrl: '' };
    }
    return this.settings;
  }
});

module.exports = settingsStore;