var React = require('react');
var Reflux = require('reflux');
var _ = require('lodash');
var Slider = require('../widgets/slider.jsx');
var actions = require('../actions');
var playbackStore = require('./playbackstore');

var PlayerControls = React.createClass({
  mixins: [Reflux.connect(playbackStore)],
  volumeChanged: function (e) {
    actions.setVolume(e.value);  
  },
  pause: function (e) {
    e.preventDefault();
    actions.pause();
  },
  play: function (e) {
    e.preventDefault();
    actions.play();
  },
  prev: function (e) {  
    e.preventDefault();
    actions.prev();
  },
  next: function (e) {
    e.preventDefault();
    actions.next();
  },
  toggleRandom: function (e) {
    e.preventDefault();
    actions.setRandom(! this.state.isRandom);
  },
  render: function() {

    var playPauseButton = this.state.isPlaying 
      ? <a href="" className="glyphicon glyphicon-pause" role="button" onClick={this.pause}></a>
      : <a href="" className="glyphicon glyphicon-play" role="button" onClick={this.play}></a>

    return (
      <ul className="list-inline">
        <li><a href="" className="glyphicon glyphicon-fast-backward" role="button" onClick={this.prev}></a></li>
        <li>{playPauseButton}</li>
        <li><a href="" className="glyphicon glyphicon-fast-forward" role="button" onClick={this.next}></a></li>
        <li>
          <Slider min={0} max={100} step={1} value={this.state.volume} toolTip={false} onSlideStop={this.volumeChanged} width={'120px'}/>
        </li>
        <li>
          <span className="glyphicon glyphicon-volume-up" />
        </li>
        <li><a href="" className={'glyphicon glyphicon-random' + this.state.isRandom ? ' active' : '' } role="button" onClick={this.toggleRandom}></a></li>
      </ul>
    );
  }

});

module.exports = PlayerControls;