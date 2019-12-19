import React, { Component } from "react";
import axios from "axios";
import "./MainMenu.css";
import CreateLobby from "./CreateLobby";
import ChooseLobby from "./ChooseLobby";
import Lobby from "./Lobby";
import Avatar from './plrAvatar.png';

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      gameCountFirst: "",
      gameCountSecond: "",
      gameCount: "", //how many games a user has played

      lobbyID: null,
      lobbyData: {},

      message: "",

      loading: true,

      view: 0 
    };
    this.joinLobby = this.joinLobby.bind(this);
    this.createLoby = this.createLoby.bind(this);
    this.logout = this.logout.bind(this);
    this.setView = this.setView.bind(this);
  }

  setView(view) {
    this.setState({ view: view });
  }

  //TODO: improve error handling
  //BUILD: modify request
  componentDidMount() {
    let self = this;
    axios
      .post(`${self.props.host}/account/stats`, {
        token: self.props.__token
      })
      .then(res => {
        self.setState({
          username: res.data.user,
          gameCountFirst: res.data.first,
          gameCountSecond: res.data.second,
          gameCount: res.data.played,
          loading: false
        });
      })
      .catch(err => {
        //TODO: error handling
        self.setState({
          message: "Error occured while gathering user statistics"
        });
        console.log(err);
      });
  }

  joinLobby(lobbyID, lobbyPassword) {
    let self = this;
    this.setState({ loading: true });
    axios
      .post(`${self.props.host}/lobby/join`, {
        lobby_id: lobbyID,
        lobby_password: lobbyPassword,
        token: self.props.__token
      })
      .then(res => {
        self.setState({
          loading: false,
          lobbyID: lobbyID,
          lobbyData: res.data,
          view: 2
        });
      })
      .catch(err => {
        console.log(err);
        self.setState({
          message: "Error occured while joining the lobby",
          loading: false
        });
      });
  }

  createLoby() {
    this.setView(1);
  }

  //TODO: improve error handling
  //BUILD: modify request
  logout() {
    let self = this;

    axios
      .post(`${self.props.host}/account/logout`, {
        token: self.props.__token
      })
      .then(res => {
        self.props.setView(0);
      })
      .catch(err => {
        //TODO: error handling
        console.log(err);
        self.props.setView(0);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading... MainScreen</p>
          <p style={{ color: "red" }}>{this.state.message}</p>
        </div>
      );
    } else {
      switch (this.state.view) {
        case 0:
          return (
            <div>
              <div className = "playerContainer">
              <img className = "avatar" alt = "Avatar" src={Avatar}/>
                <table>
                  <thead>
                    <tr>
                      <th className = "username" >{this.state.username}</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Played:</td>
                      <td>{this.state.gameCount}</td>
                    </tr>
                    <tr>
                      <td>Won:</td>
                      <td>{this.state.gameCountFirst}</td>
                    </tr>
                    <tr>
                      <td>Second:</td>
                      <td>{this.state.gameCountSecond}</td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={this.logout}>Log out</button>
              </div>
              <div className = "lobbies">
                <button className = "create" onClick={this.createLoby}>Create lobby</button>
              <p style={{ color: "red" }}>{this.state.message}</p>
              <ChooseLobby
              __token={this.props.__token}
              setView={this.setView}
              host={this.props.host}
              joinLobby={this.joinLobby}
            />
            </div>
            </div>
          );
        case 1:
          return (
            <CreateLobby
              __token={this.props.__token}
              setView={this.setView}
              username={this.state.username}
              host={this.props.host}
              joinLobby={this.joinLobby}
            />
          );
        case 2:
          return (
            <Lobby
              __token={this.props.__token}
              __dev={this.props.__dev}
              setView={this.setView}
              host={this.props.host}
              data={this.state.lobbyData}
              lobbyID={this.state.lobbyID}
            />
          );

        default:
          return <h1>You are not supposed to be here...</h1>;
      }
    }
  }
}

export default MainMenu;
