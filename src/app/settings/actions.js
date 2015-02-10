var Reflux = require('reflux');

var Actions = Reflux.createActions({ 
  'verifyMopidyUrl': { asyncResult: true },
  'verifyMopidyUrlReady': {},
  'save': {},
  'saved': {}
});

module.exports = Actions;