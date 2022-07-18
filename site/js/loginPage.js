class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isRegisterOpen: false
    };
    this.clear_cookies();
  }

  clear_cookies() {
    document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split(/\.(?=[^\.]+\.)/).reduceRight((acc, val, i, arr) => i ? arr[i] = '.' + val + acc : (arr[i] = '', arr), '').map(domain => document.cookie = `${name}=;max-age=0;path=/;domain=${domain}`));
  }

  showLoginBox() {
    this.setState({
      isLoginOpen: true,
      isRegisterOpen: false
    });
  }

  showRegisterBox() {
    this.setState({
      isRegisterOpen: true,
      isLoginOpen: false
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "root-container"
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
      className: "box-controller"
    }, /*#__PURE__*/React.createElement("div", {
      className: "controller " + (this.state.isLoginOpen ? "selected-controller" : ""),
      onClick: this.showLoginBox.bind(this)
    }, " Login"), /*#__PURE__*/React.createElement("div", {
      className: "controller " + (this.state.isRegisterOpen ? "selected-controller" : ""),
      onClick: this.showRegisterBox.bind(this)
    }, "Register")), /*#__PURE__*/React.createElement("div", {
      className: "box-container"
    }, this.state.isLoginOpen && /*#__PURE__*/React.createElement(LoginBox, null), this.state.isRegisterOpen && /*#__PURE__*/React.createElement(RegisterBox, null)));
  }

}

class LoginBox extends React.Component {
  constructor(props) {
    super(props);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.state = {
      email: "",
      password: "",
      token: "",
      isInputNotValid: false
    };
  }

  async submitLogin(e) {
    const url = '/api/users/login';
    const data = {
      "email": this.state.email,
      "password": this.state.password
    };
    console.log(this.state.email);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.status == 200 || response.status == 201) {
      const info = await response.json();
      document.cookie = "token=" + info.token;
      document.cookie = "id=" + info.id;
      this.setState({
        token: document.cookie
      });
      window.location.assign("/index.html");
    } else {
      this.setState({
        isInputNotValid: true
      });
    }
  }

  onEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "inner-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Login"), /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Email"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: this.state.email,
      name: "email",
      className: "login-input",
      placeholder: "Username",
      onChange: this.onEmailChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "password"
    }, "Password"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: this.state.password,
      name: "password",
      className: "login-input",
      placeholder: "Password",
      onChange: this.onPasswordChange
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "login-btn",
      onClick: this.submitLogin
    }, "Login"), this.state.isInputNotValid && /*#__PURE__*/React.createElement("label", {
      className: "error"
    }, "bad email/password")));
  }

}

class RegisterBox extends React.Component {
  constructor(props) {
    super(props);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
    this.state = {
      username: "",
      email: "",
      password: "",
      isInputNotValid: false
    };
  }

  onUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
    this.clearValidationErr("username");
  }

  onEmailChange(e) {
    this.setState({
      email: e.target.value
    });
    this.clearValidationErr("email");
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
    this.clearValidationErr("password");
  }

  async submitRegister(e) {
    const url = '/api/users';
    console.log(this.state);
    const data = {
      'name': this.state.username,
      "email": this.state.email,
      "password": this.state.password
    };
    console.log(this.state.email);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.status == 200 || response.status == 201) {
      const info = await response.json();
      document.cookie = "token=" + info.token;
      document.cookie = "id=" + info.id;
      window.location.assign("/index.html");
    } else {
      this.setState({
        isInputNotValid: true
      });
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "inner-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Register"), /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "username",
      className: "login-input",
      placeholder: "Username",
      onChange: this.onUsernameChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "email"
    }, "Email"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "email",
      className: "login-input",
      placeholder: "Email",
      onChange: this.onEmailChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "password"
    }, "Password"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      name: "password",
      className: "login-input",
      placeholder: "Password",
      onChange: this.onPasswordChange
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "login-btn",
      onClick: this.submitRegister
    }, "Register"), this.state.isInputNotValid && /*#__PURE__*/React.createElement("label", {
      className: "error"
    }, "please check all fields")));
  }

}