var Reflux = require('reflux');
var actions = require('../actions');
var _ = require('lodash');

var ensureFolderExists = function (folderPaths, processedPlaylists) {
  // Check if a compatible folder exists in processedPlaylists. If not, create and return it.
  var currentFolder = null;
  _.forEach(folderPaths, function (folderPath) {
    if (currentFolder === null) {
      currentFolder = _.find(processedPlaylists, function (playlistItem) {
        return playlistItem.hasOwnProperty('items') && playlistItem.name === folderPath;
      });
      if (! currentFolder) {
        currentFolder = { name: folderPath, items: [], expanded: false };
        processedPlaylists.push(currentFolder);
      }
    }
    else {
      var previousFolder = currentFolder;
      currentFolder = _.find(previousFolder.items, function (playlistItem) {
        return playlistItem.hasOwnProperty('items') && playlistItem.name === folderPath;
      });
      if (! currentFolder) {
        currentFolder = { name: folderPath, items: [], expanded: false };
        previousFolder.items.push(currentFolder);
      }
    }
  });
  return currentFolder;
};

var processPlaylists = function (playlists) {
  var processedPlaylists = [];
  // Extract playlist folders from playlist names ('/' is the separator) and shove the playlist into
  // the right folders.
  _.forEach(playlists, function (playlist) {
    var paths = playlist.name.split('/');
    if (paths.length > 1) {
      // Folders, last item in array is the playlist name
      playlist.name = paths.pop();
      var folder = ensureFolderExists(paths, processedPlaylists);
      folder.items.push(playlist);
    }
    else {
      processedPlaylists.push(playlist);
    }
  });

  return processedPlaylists;
};

var store = Reflux.createStore({
  init: function () {
    this.listenTo(actions.mopidyCalled, this.onMopidyCalled);
    this.listenTo(actions.loadPlaylists.completed, this.onPlaylistsLoaded);
  },
  onMopidyCalled: function (ev) {
    if (ev === 'event:playlistsLoaded' || ev === 'state:online') {
      actions.loadPlaylists();
    }
  },
  onPlaylistsLoaded: function (data) {
    this.playlists = processPlaylists(data);
    this.trigger(this.playlists);
  }
});

module.exports = store;