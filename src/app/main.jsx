var React = require('react'); 
var Reflux = require('reflux');
var Router = require('react-router');
var Mopidy = require('mopidy');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Header = require('./header.jsx');
var Home = require('./home.jsx');
var Settings = require('./settings/settings.jsx');

var MainStore = require('./mainstore');

var Main = React.createClass({
  mixins: [Reflux.connect(MainStore)],
  render: function () {
    return  (
      <div id="applicationhost">
        <aside id="menu" className="menu pane-col scroll-y">
          <div className="panel">
            <Link to="settings"><div className="panel-heading settings">Settings</div></Link>
          </div>
        </aside>

        <div className={"main pane-col " + (this.state.isSidebarVisibleForMobile ? " outtaway" : "")}>
          
          <Header isSidebarVisibleForMobile={this.state.isSidebarVisibleForMobile}/>
          
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