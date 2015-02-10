var Reflux = require('reflux');
var Actions = require('./actions');

var connectionStates = {
  online: 'Online',
  offline: 'Offline'
};

var mainStore = Reflux.createStore({
  getInitialState: function () {
    this.appState = {
      isSidebarVisibleForMobile: false,
      isBackVisible: false,
      connectionState: connectionStates.offline,
    };
    return this.appState;
  },
  init: function () {
    this.listenTo(Actions.toggleSidebar, this.onToggleSidebar);


  },
  onToggleSidebar: function () {
    this.appState.isSidebarVisibleForMobile = ! this.appState.isSidebarVisibleForMobile;
    this.trigger(this.appState);
  }
});

module.exports = mainStore;