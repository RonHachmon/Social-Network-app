class MessagePage extends React.Component {
  constructor(props) {
    super(props);
    let cookiesArray = document.cookie.split("; ");
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
      id: i_id
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "root-container"
    }, /*#__PURE__*/React.createElement(Navbar, {
      id: this.state.id
    }), /*#__PURE__*/React.createElement(MessageList, {
      token: this.state.token,
      id: this.state.id
    }));
  }

}

class CreateMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      id: ""
    };
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onIDChange = this.onIDChange.bind(this);
    this.submit_message = this.submit_message.bind(this);
  }

  onMessageChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  onIDChange(e) {
    this.setState({
      id: e.target.value
    });
  }

  async submit_message(e) {
    const url = '/api/message/' + this.state.id;
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
      className: "CreatePost"
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "User ID",
      className: "id-input",
      onChange: this.onIDChange
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Enter message",
      className: "msg-input",
      onChange: this.onMessageChange
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "post-button",
      onClick: this.submit_message
    }, "Send message"));
  }

}

class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creator_name: " "
    };
    this.get_creator_name();
  }

  async get_creator_name() {
    const url = '/api/user/' + this.props.message.creator_ID;
    const token = this.props.token;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    let data = await response.json();
    this.setState({
      creator_name: data.name
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "MessageItem",
      "data-id": this.props.message.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "PosterName"
    }, /*#__PURE__*/React.createElement("span", null, this.state.creator_name)), /*#__PURE__*/React.createElement("div", {
      className: "PostContent"
    }, /*#__PURE__*/React.createElement("span", null, this.props.message.content)));
  }

}

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      new_message: false
    };
    this.update_list = this.update_list.bind(this);
    this.new_post = setInterval(async () => {
      const data = await this.fetch_messages();

      if (data.length > this.state.messages.length) {
        this.setState({
          new_message: true
        });
      }
    }, 1000 * 30);
  }

  componentDidMount() {
    this.update_list();
  }

  async fetch_messages() {
    const token = this.props.token;
    const response = await fetch('/api/message', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.status == 401) {
      window.location.assign("/LoginPage.html");
    }

    let data = await response.json();
    data = data.sort((a, b) => {
      return new Date(b.creation_date) - new Date(a.creation_date);
    });
    return data;
  }

  async update_list() {
    const data = await this.fetch_messages();
    this.setState({
      messages: data,
      new_message: false
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "CreateMessage"
    }, /*#__PURE__*/React.createElement(CreateMessage, {
      token: this.props.token
    }), /*#__PURE__*/React.createElement("div", {
      className: "MessageList"
    }, this.state.messages.slice(0, 10).map((item, index) => {
      return /*#__PURE__*/React.createElement(MessageItem, {
        message: item,
        token: this.props.token,
        key: index
      });
    })), this.state.new_message && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "refresh-button",
      onClick: this.update_list
    }, "Update"));
  }

}