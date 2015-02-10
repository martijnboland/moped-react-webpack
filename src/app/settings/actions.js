var Reflux = require('reflux');

var actions = Reflux.createActions({ 
  'verifyMopidyUrl': { asyncResult: true },
  'verifyMopidyUrlReady': {},
  'save': {},
  'saved': {}
});

module.exports = actions;