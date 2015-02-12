var Reflux = require('reflux');
var Mopidy = require('mopidy');
var actions = require('../actions');
var settingsStore = require('../settings/store');

var connectionStates = {
  online: 'Online',
  offline: 'Offline'
};

var mopidyStore = Reflux.createStore({
  init: function () {
    this.connectionState = connectionStates.offline;
    this.listenTo(settingsStore, this.onSettingsChanged, this.start); // NOTE: this.start is called here!
    this.listenTo(actions.loadPlaylists, this.onLoadPlaylists);
  },
  getInitialState: function () {
    return this.connectionState;
  },
  start: function (settings) {
    var self = this;

    // Create Mopidy instance
    if (settings.mopidyUrl !== '') {
      this.mopidy = new Mopidy({
        webSocketUrl: settings.mopidyUrl,
        callingConvention: 'by-position-or-by-name'
      });
    } else {
      this.mopidy = new Mopidy({
        callingConvention: 'by-position-or-by-name'
      });
    }

    // Wireup Mopidy events
    this.mopidy.on(function(ev, args) {
      actions.mopidyCalled(ev, args);
      if (ev === 'state:online') {
        self.connectionState = connectionStates.online;
        self.trigger(self.connectionState);
      }
      if (ev === 'state:offline') {
        self.connectionState = connectionStates.offline;
        self.trigger(self.connectionState);
      }
    });
  },
  stop: function () {
    this.mopidy.close();
    this.mopidy.off();
    this.mopidy = null;
  },
  onSettingsChanged: function (settings) {
    this.stop();
    this.start(settings);
  },
  onLoadPlaylists: function () {
    actions.loadPlaylists.promise(this.mopidy.playlists.getPlaylists());
  }
});

module.exports = mopidyStore;