class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    let cookiesArray = document.cookie.split("; ");
    let i_id;

    for (let i = 0; i < cookiesArray.length; i++) {
      let value_name = cookiesArray[i].split("=");

      if (value_name[0] == "id") {
        i_id = value_name[1];
      }
    }

    this.state = {
      id: i_id
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "root-container"
    }, /*#__PURE__*/React.createElement(Navbar, {
      id: this.state.id
    }), /*#__PURE__*/React.createElement(About, null));
  }

}

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "About"
    }, /*#__PURE__*/React.createElement("p", null, "Created by Ron Hachmon"), /*#__PURE__*/React.createElement("p", null, "id: 207229428"), /*#__PURE__*/React.createElement("p", null, "for assistance  please contact ronhc@mta.ac.il"));
  }

}