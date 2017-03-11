import React from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux'
import { logout } from '../actions/auth';

class Header extends React.Component {
  handleLogout(event) {
    event.preventDefault();
    this.props.dispatch(logout());
  }

  render() {
    var active ={};
    if(this.props.user)
      active = { borderBottomColor: this.props.user.primaryColor };
    const leftNavMindMap = this.props.token ? (
        <li><Link to="/mindmap" activeStyle={active}>Mindmap</Link></li>
    ):(<li></li>);
    const leftNavNodes = this.props.token ? (
        <li><Link to="/nodes" activeStyle={active}>Nodes</Link></li>
    ):(<li></li>);
    const rightNav = this.props.token ? (
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">
            <img src={this.props.user.picture || this.props.user.gravatar}/>
            {' '}{this.props.user.name || this.props.user.email || this.props.user.id}{' '}
            <i className="caret"></i>
          </a>
          <ul className="dropdown-menu">
            <li><Link to="/account">My Account</Link></li>
            <li className="divider"></li>
            <li><Link to="/login" onClick={this.handleLogout.bind(this)}>Logout</Link></li>
          </ul>
        </li>
      </ul>
    ) : (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/login" activeStyle={active}>Log in</Link></li>
        <li><Link to="/signup" activeStyle={active}>Sign up</Link></li>
      </ul>
    );
    return (
      <nav className="navbar navbar-default navbar-static-top" style={{zIndex:2}}>
        <div className="container">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target="#navbar" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <IndexLink to="/" className="navbar-brand">Bubblesort</IndexLink>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              {leftNavMindMap}
              {leftNavNodes}
            </ul>
            {rightNav}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Header);
