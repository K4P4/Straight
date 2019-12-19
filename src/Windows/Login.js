import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",

      _min_pass_length: 6, //Leaving it to 6 while developing the application.
      _max_pass_length: 128,
      _min_user_length: 3,
      _max_user_length: 32,

      disabledButton: false
    };
    this.registerView = this.registerView.bind(this);
    this.processLogin = this.processLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  mainScreenView() {
    this.props.setView(3);
  }

  registerView() {
    this.props.setView(2);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, message: "" });
  }

  validateForm() {
    let err = "";
    let { username, password } = this.state,
      {
        _max_pass_length,
        _min_pass_length,
        _max_user_length,
        _min_user_length
      } = this.state;

    if (username.length < _min_user_length) {
      err = `Username is too short. Min ${_min_user_length} characters.`;
    } else if (username.length > _max_user_length) {
      err = `Username is too long. Max ${_max_pass_length} characters.`;
    } else if (password.length < _min_pass_length) {
      err = `Password is too short. Min ${_min_pass_length} characters.`;
    } else if (password.length > _max_pass_length) {
      err = `Password is too long. Max ${_max_pass_length} characters.`;
    }

    this.setState({ message: err });

    return err === "";
  }

  processLogin(event) {
    event.preventDefault();
    var self = this;

    this.setState({ disabledButton: true }, () => {
      if (this.validateForm()) {
        //credentials meet requirements
        axios
          .post(`${self.props.host}/account/login`, {
            username: self.state.username,
            password: self.state.password
          })
          .then(res => {
            //registration succeded
            //BUILD: clean up
            if (self.props.__dev) {
              self.props.__setToken(res.data.token);
            }
            self.mainScreenView();
          })
          .catch(err => {
            console.log(err);
            self.setState({
              message: "An error ocurred while logging in",
              disabledButton: false
            });
          });
      } else {
        self.setState({ disabledButton: false });
      }
    });
  }

  render() {
    return (
      <div className = "loginContainer">
        <h2>Log in and Play!</h2>
        <form onSubmit={this.processLogin}>
          <label className = "logRegLabel" htmlFor="user"><b>Username</b></label> <br />
            <input className = "logRegInput"
              type="text"
              placeholder="Enter Username"
              value={this.state.username}
              name="username"
              onChange={this.handleChange}
              required
          /><br />
          <label className = "logRegLabel" htmlFor="pass"><b>Password</b></label> <br />
            <input className = "logRegInput"
            type="password"
            placeholder="Enter Password"
            value={this.state.password}
            name="password"
            onChange={this.handleChange}
            required
          /><br />

          <p style={{ color: "red" }}>{this.state.message}</p>

          <button className = "loginButton"
            variant="primary"
            type="submit"
            disabled={this.state.disabledButton}
          >
            Login
          </button>
          <br />
          <p className = "redirectP"> Don't have an account?
          <button className = "redirect" onClick={this.registerView}>
            Register here!
          </button>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;
