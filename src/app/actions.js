var Reflux = require('Reflux');

var actions = Reflux.createActions({
  'toggleSidebar' : {},

  'loadPlaylists': { asyncResult: true },
  'loadPlaylist' : {},

  'mopidyCalled' : {},

  'play' : {},
  'pause' : {},
  'prev' : {},
  'next' : {},
  'toggleRandom' : {},
  'seek' : {}
});

module.exports = actions;