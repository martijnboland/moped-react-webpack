var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var _ = require('lodash');
var playlistsStore = require('./store');
var actions = require('../actions');

var TrackList = require('../widgets/tracklist.jsx');

var Playlist = React.createClass({
  mixins: [
    Reflux.listenTo(playlistsStore, 'onPlaylistsChanged'),
    Router.State
  ],
  getInitialState: function () {
    return {
      playlists: [],
      currentPlaylistUri: null,
      currentPlaylist: null
    }
  },
  componentWillMount: function () {
    this.loadPlaylist();
  },
  componentWillReceiveProps: function () {
    this.loadPlaylist();
  },
  onPlaylistsChanged: function (playlists) {
    var currentPlaylist = _.find(playlists, { uri: this.state.currentPlaylistUri });
    this.setState({ playlists: playlists, currentPlaylist: currentPlaylist })
  },
  loadPlaylist: function () {
    var uri = this.getParams().uri;
    var currentPlaylist = null;
    if (this.state.playlists.length === 0) {
      actions.loadPlaylists();
    } else {
      currentPlaylist = _.find(this.state.playlists, { uri: uri });
    }
    this.setState({ currentPlaylistUri: uri, currentPlaylist: currentPlaylist });
  },
  render: function () {
    if (this.state.currentPlaylist) {
      return (
        <div>
          <div className="row view-title">
            <h3>{this.state.currentPlaylist.name}</h3>
          </div>
          <TrackList tracks={this.state.currentPlaylist.tracks}/>
        </div>
      )
    } else {
      return (
        <div/>
      )
    }
  }
});

module.exports = Playlist;
