var Reflux = require('Reflux');

var actions = Reflux.createActions({
  'toggleSidebar' : {},

  'loadPlaylists': { asyncResult: true },
  'loadPlaylist' : {},

  'mopidyCalled' : {},

  'getPlaybackState' : { asyncResult: true },
  'getVolume' : { asyncResult: true },
  'getRandom' : { asyncResult: true },
  'getTimePosition' : { asyncResult: true },
  'getCurrentTrack' : { asyncResult: true },

  'playTrackRequest' : {},
  'playTrack' : {},

  'play' : {},
  'pause' : {},
  'prev' : {},
  'next' : {},
  'setVolume' : {},
  'setRandom' : {},
  'seek' : {},
  'seeking' : {}
});

module.exports = actions;