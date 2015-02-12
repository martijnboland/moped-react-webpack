var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var playlistsStore = require('./store');

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
        <Link to="playlist" params={{id: this.props.playlist.uri}}><span className="glyphicon glyphicon-music"></span> {this.props.playlist.name}</Link>
      </li>
    );
  }
});

var PlaylistList = React.createClass({
  render: function() {

    var createItem = function(item) {
      if (item.items) {
        return <PlaylistFolder folder={item}/>
      } else {
        return <PlaylistItem playlist={item}/>
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
  mixins: [Reflux.connect(playlistsStore, "playlists")],
  getInitialState: function () {
    return {
      playlists: []
    }
  },
  render: function() {
    return (      
      <div className="panel">
        <div className="panel-heading playlists">Playlists</div>
        <div className="panel-body">
          <PlaylistList items={this.state.playlists} isTopLevel={true}/>
        </div>
      </div>
    );
  }
});

module.exports = PlaylistMenu;