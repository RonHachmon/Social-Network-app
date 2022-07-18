class WaitPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "root-container"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement(Wait, null));
  }

}

class Wait extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "About"
    }, /*#__PURE__*/React.createElement("p", null, "User created,"), /*#__PURE__*/React.createElement("p", null, "please wait for admin approval"), /*#__PURE__*/React.createElement("p", null, "for assistance please contact ronhc@mta.ac.il"));
  }

}