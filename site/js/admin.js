class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    let cookiesArray = document.cookie.split("; ");
    this.manageUserClicked = this.manageUserClicked.bind(this);
    this.sendMessageClicked = this.sendMessageClicked.bind(this);
    let i_id;
    let i_token;

    for (let i = 0; i < cookiesArray.length; i++) {
      let value_name = cookiesArray[i].split("=");

      if (value_name[0] == "token") {
        i_token = value_name[1];
      }

      if (value_name[0] == "id") {
        i_id = value_name[1];
      }
    }

    this.state = {
      token: i_token,
      id: i_id,
      isApproveUserClicked: false,
      isSendMessageToAllClicked: false
    };
  }

  sendMessageClicked() {
    this.setState({
      isApproveUserClicked: false,
      isSendMessageToAllClicked: true
    });
  }

  manageUserClicked() {
    this.setState({
      isApproveUserClicked: true,
      isSendMessageToAllClicked: false
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "root-container"
    }, /*#__PURE__*/React.createElement(Navbar, {
      id: this.state.id
    }), /*#__PURE__*/React.createElement("div", {
      className: "button-manager"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "manage-button",
      onClick: this.sendMessageClicked
    }, "Send message to all"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "manage-button",
      onClick: this.manageUserClicked
    }, "Manage users")), this.state.isSendMessageToAllClicked && /*#__PURE__*/React.createElement(CreateMessage, {
      token: this.state.token
    }), this.state.isApproveUserClicked && /*#__PURE__*/React.createElement(ListUsers, {
      token: this.state.token
    }));
  }

}

class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
    this.onStatusChange = this.onStatusChange.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async onStatusChange(e) {
    const user_id = this.props.user.id;
    const status = e.target.innerText;

    if (status == 'deleted') {
      this.deleteUser(user_id);
    } else {
      const url = '/api/user/' + user_id + '?status=' + status;
      const token = this.props.token;
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
    }

    this.props.updateList();
  }

  async deleteUser(id) {
    const url = '/api/user/' + id;
    const token = this.props.token;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "UserItem"
    }, /*#__PURE__*/React.createElement("div", {
      className: "UserDetails"
    }, /*#__PURE__*/React.createElement("p", null, "name: ", this.props.user.name, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "email:", this.props.user.email, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "current status:", this.props.user.status, /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "approve-button",
      onClick: this.onStatusChange
    }, "active"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "suspend-button",
      onClick: this.onStatusChange
    }, "suspended"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "deleted-button",
      onClick: this.onStatusChange
    }, "deleted")));
  }

}

class ListUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      user_type_selected: false,
      choosen_type: ""
    };
    this.onTypeChange = this.onTypeChange.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  componentDidMount() {
    this.updateList();
  }

  async updateList() {
    const token = this.props.token;
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.status == 401) {
      window.location.assign("/LoginPage.html");
    } //forbidden


    if (response.status == 403) {
      window.location.assign("/index.html");
    }

    let data = await response.json();
    this.setState({
      users: data
    });
  }

  onTypeChange(e) {
    this.setState({
      choosen_type: e.target.innerText,
      user_type_selected: true
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "ListOfUser"
    }, /*#__PURE__*/React.createElement("span", null, "choose status type user: "), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "manage-button",
      onClick: this.onTypeChange
    }, "all"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "manage-button",
      onClick: this.onTypeChange
    }, "created"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "manage-button",
      onClick: this.onTypeChange
    }, "suspended"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "manage-button",
      onClick: this.onTypeChange
    }, "active"), /*#__PURE__*/React.createElement("hr", null), this.state.user_type_selected && /*#__PURE__*/React.createElement("div", {
      className: "UserList"
    }, this.state.users.filter(user => this.state.choosen_type == 'all' || user.status == this.state.choosen_type).map((item, index) => {
      return /*#__PURE__*/React.createElement(UserItem, {
        user: item,
        token: this.props.token,
        updateList: this.updateList,
        key: index
      });
    })));
  }

}

class CreateMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.onMessageChange = this.onMessageChange.bind(this);
    this.submit_message = this.submit_message.bind(this);
  }

  onMessageChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  async submit_message(e) {
    const url = '/api/message';
    const data = {
      "content": this.state.message
    };
    const token = this.props.token;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data)
    });

    if (response.status != 201) {
      throw new Error('Error while sending message');
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "box-container"
    }, /*#__PURE__*/React.createElement("input", {
      className: "msg-input",
      placeholder: "Enter message",
      onChange: this.onMessageChange
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "post-button",
      onClick: this.submit_message
    }, "Send message"));
  }

}