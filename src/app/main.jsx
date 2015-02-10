var React = require('react'); 
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Home = require('./home.jsx');
var Settings = require('./settings/settings.jsx');

var connectionStates = {
  online: 'Online',
  offline: 'Offline'
};

var Main = React.createClass({
  getInitialState: function() {
    return {
      isSidebarVisibleForMobile: false,
      isBackVisible: false,
      connectionState: connectionStates.offline
    };
  },
  toggleSidebar: function(e) {
    this.setState({ isSidebarVisibleForMobile: ! this.state.isSidebarVisibleForMobile });
  },
  goBack: function(e) {
    window.history.back();
  },
  render: function () {
    return  (
      <div id="applicationhost">
        <aside id="menu" className="menu pane-col scroll-y">
          <div className="panel">
            <Link to="settings"><div className="panel-heading settings">Settings</div></Link>
          </div>
        </aside>

        <div className={"main pane-col " + (this.state.isSidebarVisibleForMobile ? " outtaway" : "")}>

          <header>
            <button type="button" className={"navbar-toggle" + (this.state.isSidebarVisibleForMobile ? " outtaway" : "")} data-toggle="collapse" onClick={this.toggleSidebar}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <div className="title-bar">
              <div className="pull-right">
                Status: 
              </div>
              <div className="pull-right working" ng-show="working">
              </div>
              <a href="#">Back</a>
              <a href="#">Home</a>
            </div>
          </header>

          <section id="maincontent" className="maincontent pane-row scroll-y">
            <div className="container">
              <RouteHandler/>
            </div>
          </section>

          <section className="nowplaying pane-row">
            
          </section>

          <section className="controls pane-row">
            
          </section>
        </div>      
      </div>
    );
  }
});

var routes = (
  <Route name="main" path="/" handler={Main}>
    <Route name="settings" handler={Settings}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = Main;