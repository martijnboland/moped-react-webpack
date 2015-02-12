var Reflux = require('reflux');
var actions = require('../actions');
var mopidyStore = require('./mopidystore');

var mainStore = Reflux.createStore({
  getInitialState: function () {
    this.appState = {
      isSidebarVisibleForMobile: false,
      isBackVisible: false,
      connectionState: null,
    };
    return this.appState;
  },
  init: function () {
    this.listenTo(mopidyStore, this.onConnectionStateUpdated);
    this.listenTo(actions.toggleSidebar, this.onToggleSidebar);
  },
  onToggleSidebar: function () {
    this.appState.isSidebarVisibleForMobile = ! this.appState.isSidebarVisibleForMobile;
    this.trigger(this.appState);
  },
  onConnectionStateUpdated: function (connectionState) {
    this.appState.connectionState = connectionState;
    this.trigger(this.appState);
  }
});

module.exports = mainStore;