var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var _ = require('lodash');
var playlistsStore = require('./store');

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

var PlaylistFolder = React.createClass({
  getInitialState: function () {
    return {
      isExpanded: false
    }
  },
  toggle: function (e) {
    e.preventDefault();
    this.setState({ isExpanded: ! this.state.isExpanded });
  },
  render: function () {
    
    var folderItems = (function () {
      if (this.state.isExpanded) {
        return <PlaylistList items={this.props.folder.items}/>
      }
      else {
        return null;
      }
    }).bind(this);

    return (
      <div>
        <a href="" onClick={this.toggle}><span className={'glyphicon ' + (this.state.isExpanded ? 'glyphicon-folder-open' : 'glyphicon-folder-close')}></span> {this.props.folder.name}</a>
        <div>{folderItems(this.state.isExpanded)}</div>
      </div>
    );
  }
});

var PlaylistItem = React.createClass({
  render: function () {
    return (
      <li className="list-group-item">
        <Link to="playlist" params={{uri: this.props.playlist.uri}}><span className="glyphicon glyphicon-music"></span> {this.props.playlist.name}</Link>
      </li>
    );
  }
});

var PlaylistList = React.createClass({
  render: function() {

    var createItem = function(item) {
      if (item.items) {
        return <PlaylistFolder key={item.name} folder={item}/>
      } else {
        return <PlaylistItem key={item.uri} playlist={item}/>
      }
    };

    return (
      <ul className={this.props.isTopLevel ? 'list-group' : ''}>
        {this.props.items.map(createItem)}
      </ul>
    );
  }
});

var PlaylistMenu = React.createClass({
  mixins: [Reflux.listenTo(playlistsStore,"onPlaylistsChanged")],
  getInitialState: function () {
    return {
      playlists: []
    }
  },
  onPlaylistsChanged: function (playlists) {
    this.setState({ playlists: processPlaylists(playlists) });
  },
  render: function() {
    return (      
      <div className="panel">
        <div className="panel-heading playlists">Playlists</div>
        <div className="panel-body">
          <PlaylistList items={processPlaylists(this.state.playlists)} isTopLevel={true}/>
        </div>
      </div>
    );
  }
});

module.exports = PlaylistMenu;