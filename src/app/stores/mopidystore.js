var Reflux = require('reflux');
var Mopidy = require('mopidy');
var _ = require('lodash');
var actions = require('../actions');
var settingsStore = require('../settings/store');
var connectionStates = require('../constants').connectionStates;

var consoleError = console.error.bind(console);

var mopidyStore = Reflux.createStore({
  currentTlTracks: [],
  init: function () {
    this.connectionState = connectionStates.offline;
    this.listenTo(settingsStore, this.onSettingsChanged, this.start); // NOTE: this.start is called here!
    this.listenToMany(actions);
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
  onPlayTrack: function(track, surroundingTracks) {
    var self = this;

    // Check if a playlist change is required. If not just change the track.
    if (self.currentTlTracks.length > 0) {
      var trackUris = _.pluck(surroundingTracks, 'uri');
      var currentTrackUris = _.map(self.currentTlTracks, function(tlTrack) {
        return tlTrack.track.uri;
      });
      if (_.difference(trackUris, currentTrackUris).length === 0) {
        // no playlist change required, just play a different track.
        self.mopidy.playback.stop({ clear_current_track: false })
          .then(function () {
            var tlTrackToPlay = _.find(self.currentTlTracks, function(tlTrack) {
              return tlTrack.track.uri === track.uri;
            });
            self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay })
              .then(function() {
                self.mopidy.playback.play();
              });
          });
        return;
      }
    }

    self.mopidy.playback.stop({ clear_current_track: true })
      .then(function() {
        self.mopidy.tracklist.clear();
      }, consoleError)
      .then(function() {
        self.mopidy.tracklist.add({ tracks: surroundingTracks });
      }, consoleError)
      .then(function() {
        self.mopidy.tracklist.getTlTracks()
          .then(function(tlTracks) {
            self.currentTlTracks = tlTracks;
            var tlTrackToPlay = _.find(tlTracks, function(tlTrack) {
              return tlTrack.track.uri === track.uri;
            });
            self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay })
              .then(function() {
                self.mopidy.playback.play();
              });
          }, consoleError);
      } , consoleError);
  },
  onSettingsChanged: function (settings) {
    this.stop();
    this.start(settings);
  },
  onLoadPlaylists: function () {
    actions.loadPlaylists.promise(this.mopidy.playlists.getPlaylists());
  },
  onGetPlaybackState: function () {
    actions.getPlaybackState.promise(this.mopidy.playback.getState());
  },
  onGetVolume: function () {
    actions.getVolume.promise(this.mopidy.playback.getVolume());
  },
  onGetRandom: function () {
    actions.getRandom.promise(this.mopidy.tracklist.getRandom());
  },
  onGetTimePosition: function () {
    actions.getTimePosition.promise(this.mopidy.playback.getTimePosition());
  },
  onGetCurrentTrack: function () {
    actions.getCurrentTrack.promise(this.mopidy.playback.getCurrentTrack());
  },
  onPlay: function () {
    this.mopidy.playback.play();
  },
  onPause: function () {
    this.mopidy.playback.pause();
  },
  onPrev: function () {
    this.mopidy.playback.previous();
  },
  onNext: function () {
    this.mopidy.playback.next();
  },
  onSetVolume: function (volume) {
    this.mopidy.playback.setVolume({ volume: volume });
  },
  onSetRandom: function (isRandom) {
    this.mopidy.tracklist.setRandom([ isRandom ]);
  },
  onSeek: function (timePosition) {
    this.mopidy.playback.seek({time_position: timePosition});
  }
});

module.exports = mopidyStore;