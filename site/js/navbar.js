const MenuItem = [{
  title: 'Home',
  url: '/index.html',
  name: 'nav-links'
}, {
  title: 'Messages',
  url: '/Messages.html',
  name: 'nav-links'
}, {
  title: 'About',
  url: '/about.html',
  name: 'nav-links'
}, {
  title: 'Logout',
  url: '/LoginPage.html',
  name: 'nav-links'
}];
const AdminItem = [{
  title: 'Admin',
  url: '/admin.html',
  name: 'nav-links'
}];

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handle_click = this.handle_click.bind(this);
    this.state = {
      isClicked: false
    };

    if (this.props.id == 1) {
      MenuItem.splice(2, 0, AdminItem[0]);
    }
  }

  handle_click = () => {
    this.setState({
      isClicked: !this.state.isClicked
    });
  };

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "NavbarItems"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "navbar-logo"
    }, "MTA-BOOK", /*#__PURE__*/React.createElement("i", {
      class: "fa-solid fa-graduation-cap"
    })), /*#__PURE__*/React.createElement("div", {
      className: "menu-icon",
      onClick: this.handle_click
    }, /*#__PURE__*/React.createElement("i", {
      className: this.state.isClicked ? 'fas fa-times' : 'fas fa-bars'
    })), this.props.id && /*#__PURE__*/React.createElement("ul", {
      className: this.state.isClicked ? 'nav-menu-active' : 'nav-menu'
    }, MenuItem.map((item, index) => {
      return /*#__PURE__*/React.createElement("li", {
        key: index
      }, /*#__PURE__*/React.createElement("a", {
        className: item.name,
        href: item.url
      }, item.title));
    })));
  }

}