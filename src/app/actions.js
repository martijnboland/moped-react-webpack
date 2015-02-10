var Reflux = require('Reflux');

var Actions = Reflux.createActions([
  'toggleSidebar',
  'play',
  'pause',
  'prev',
  'next',
  'toggleRandom',
  'seek'
]);

module.exports = Actions;