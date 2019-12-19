import React, { Component } from "react";
import axios from "axios";

class CreateLobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lobby_name: this.props.username + "'s lobby",
      lobby_password: "",
      lobby_id: null,

      message: "",

      disabledButton: false
    };

    this.mainScreenView = this.mainScreenView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.lobbyView = this.lobbyView.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, message: "" });
  }

  mainScreenView() {
    this.props.setView(0);
  }

  lobbyView(event) {
    event.preventDefault();
    let self = this;
    this.setState({ disabledButton: true }, () => {
      axios
        .post(`${self.props.host}/lobby/create`, {
          token: self.props.__token,
          lobby_password: self.state.lobby_password,
          lobby_name: self.state.lobby_name
        })
        .then(res => {
          self.props.joinLobby(res.data.lobby_id, this.state.lobby_password);
        })
        .catch(err => {
          console.log(err);
          self.setState({
            message: "An error ocurred while creating a lobby",
            disabledButton: false
          });
        });
    });
  }

  render() {
    return (
      <div className = "registerContainer">
        <h2> Create Lobby </h2>
        <form onSubmit={this.lobbyView}>
            <label className = "logRegLabel">Lobby name</label>
            <input className = "logRegInput"
              type="text"
              placeholder={this.state.lobby_name}
              name="lobby_name"
              onChange={this.handleChange}/>
            <label className = "logRegLabel">Password</label>
            <input className = "logRegInput"
              type="text"
              placeholder="Enter lobby password"
              name="lobby_password"
              onChange={this.handleChange}/>
              <p>
              Leave the field empty if you don't want to protect the lobby with
              a password
              </p>
          <button
            type="submit"
            disabled={this.state.disabledButton}
          >
            Create
          </button>
          <button onClick={this.mainScreenView}>
            Back
          </button>
        <p style={{ color: "red" }}>{this.state.message}</p>
        </form>
      </div>
    );
  }
}

export default CreateLobby;
