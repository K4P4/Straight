import React, { Component } from "react";
import isEmail from "validator/lib/isEmail";
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      cpassword: "",

      is_from_valid: false,
      message: "",
      messColor: "",

      _min_pass_length: 6, //Leaving it to 6 while developing the application and not realeasing it to the public.
      _max_pass_length: 128,
      _min_user_length: 3,
      _max_user_length: 32,

      disabledButton: false
    };
    this.loginView = this.loginView.bind(this);
    this.processRegister = this.processRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  loginView(){
    this.props.setView(1);
  }

  //temporary form validation
  validateForm() {
    let err = "";
    let { username, email, password, cpassword } = this.state,
      {
        _max_pass_length,
        _min_pass_length,
        _max_user_length,
        _min_user_length
      } = this.state;

    //Check email
    if (!isEmail(email)) {
      err = `Invalid email.`;
    } else if (username.length < _min_user_length) {
      err = `Username is too short. Min ${_min_user_length} characters.`;
    } else if (username.length > _max_user_length) {
      err = `Username is too long. Max ${_max_pass_length} characters.`;
    } else if (password.length < _min_pass_length) {
      err = `Password is too short. Min ${_min_pass_length} characters.`;
    } else if (password.length > _max_pass_length) {
      err = `Password is too long. Max ${_max_pass_length} characters.`;
    } else if (password !== cpassword) {
      err = `Password and confirmed password do not match.`;
    }

    this.setState({ message: err, messColor: "red" });

    return err === "";
  }

  processRegister(event) {
    //TODO: Check if Data is correct
    event.preventDefault();
    var self = this;

    this.setState({ disabledButton: true }, () => {
      if (this.validateForm()) {
        //data is valid
        axios
          .post(`${self.props.host}/account/register`, {
            username: self.state.username,
            password: self.state.password,
            email: self.state.email
          })
          .then(res => {
            //registration succeded
            self.setState({
              message: "Registration successful!",
              messColor: "green",
              disabledButton: false
            });
          })
          .catch(err => {
            console.log(err);
            self.setState({
              message: "An error ocurred while registering new user",
              disabledButton: false
            });
          });
      } else {
        self.setState({ disabledButton: false });
      }
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, message: "" });
  }

  render() {
    return (
      <div className = "registerContainer">
        <h2>Register an account...</h2>
        <form onSubmit={this.processRegister}>

            <label className = "logRegLabel">Email Address</label>
            <input className = "logRegInput"
              onChange={this.handleChange}
              type="text"
              placeholder="Enter email"
              name="email"
              required
              /><br />

          <label className = "logRegLabel">Username</label>
          <input className = "logRegInput"
              onChange={this.handleChange}
              placeholder="Enter username"
              type="text"
              name="username"
              required
              />
              <br/>
              <br/>
            <label className = "logRegLabel">Password</label>
              <input className = "logRegInput"
                type="password"
                onChange={this.handleChange}
                placeholder="Enter password"
                name="password"
                required
              />
              <label className = "logRegLabel">Confirm Password</label>
              <input className = "logRegInput"
                type="password"
                onChange={this.handleChange}
                placeholder="Re-enter password"
                name="cpassword"
                required
              />
          <p style={{ color: this.state.messColor }}>{this.state.message}</p>

          <button className = "loginButton"
            type = "submit"
            disabled={this.state.disabledButton}
          >
            Register
            </button>
            
            <br/>
            <p className = "redirectP"> Already have an account?
          <button className = "redirect" onClick={this.loginView}>
            Login here!
          </button>
          </p>
        </form>
      </div>
    );
  }
}

export default Register;
