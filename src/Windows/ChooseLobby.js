import React, { Component } from "react";
import axios from "axios";

class ChooseLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: "",
      data: {},
      page: 1,
      lobbiesOnPage: 3,
      lobbyAmount: 4,
      lobbyPasword: "",
      chosenIndex: null,
      password: ""
    };

    this.renderTable = this.renderTable.bind(this);
    this.chooseLobby = this.chooseLobby.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
    this.refreshLobbies = this.refreshLobbies.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.renderPassword = this.renderPassword.bind(this);
  }

  componentDidMount() {
    this.refreshLobbies();
  }

  refreshLobbies() {
    let self = this;
    axios
      .post(`${self.props.host}/lobby/getLobbyList`, {
        token: self.props.__token,
        page: self.state.page,
        lobbies_on_page: self.state.lobbiesOnPage
      })
      .then(res => {
        self.setState({ data: res.data, loading: false, chosenIndex: null });
      })
      .catch(err => {
        console.log(err);
        self.setState({
          message: "Error occurred while getting lobby information",
          chosenIndex: null
        });
      });
  }

  chooseLobby(key) {
    this.setState({chosenIndex: +key });
    console.log(this.state.chosenIndex);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value, message: "" });
  }

  renderPassword(){
    return(
      <div className = "passWindow">
        <p>Password</p>
        <input name="password" onChange={this.handleChange} />
      </div>
    )
  }

  joinLobby() {
    if (this.state.chosenIndex == null) {
      this.setState({ message: "Please choose a lobby to join." });
    } else if (
      this.state.password.length === 0 &&
      this.state.data[this.state.chosenIndex].requires_password
    ) {
      this.setState({ message: "Please enter the lobby password." });
    } else {
      this.props.joinLobby(
        this.state.data[this.state.chosenIndex]._id,
        this.state.password
      );
    }
  }

  async previousPage() {
    await this.setState({ page: this.state.page - 1 });
    this.refreshLobbies();
  }

  async nextPage() {
    await this.setState({page: this.state.page + 1});
    this.refreshLobbies();
  }

  async firstPage() {
    await this.setState({page: 1});
    this.refreshLobbies();
  }

  async lastPage() {
    await this.setState({page: Math.ceil(this.state.lobbyAmount/this.state.lobbiesOnPage)});
    this.refreshLobbies();
  }

  renderTable() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th className = "requiresPass"><span role = "img" aria-label = "pass locked">🔒</span></th>
              <th>Players</th>
              <th>Lobby Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((lobby, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => this.chooseLobby(index)}
                  className={index === this.state.chosenIndex ? "selected" : "notSelected"}
                >
                  <th className = "requiresPass">{lobby.requires_password ? "🔒" : ""}</th>
                  <th className = "plrCount">{`${lobby.player_count}/6`}</th>
                  <th className = "lobbyName">{lobby.name}</th>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className = "pageSelectors">
        <button className = "previous" onClick = {this.firstPage}
          disabled = {this.state.page < 2}><span>∣◀</span></button>
          <button className = "previous" onClick = {this.previousPage}
          disabled = {this.state.page < 2}><span>◀</span></button>
            <input
              className="pageSelect"
              name="page"
              value={this.state.page}
              onChange={this.handleChange}
              disabled={true}
            />
            <span className = "slash">\</span>
            <input
              className="pageSelect"
              name="allPages"
              value={Math.ceil(this.state.lobbyAmount/this.state.lobbiesOnPage)}
              onChange={this.handleChange}
              disabled={true}
            />
          <button className = "next" onClick = {this.nextPage}
          disabled = {this.state.page >= this.state.lobbyAmount/this.state.lobbiesOnPage}><span>▶</span></button>
          <button className = "next" onClick = {this.lastPage}
          disabled = {this.state.page >= this.state.lobbyAmount/this.state.lobbiesOnPage}><span>▶∣</span></button>
        </div>

        <button className = "join" onClick={this.joinLobby}>Join</button>
        <button className = "refresh" onClick={this.refreshLobbies}>Refresh</button>
        <p style={{ color: "red" }}>{this.state.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p>Loading... ChooseLobby</p>
          <p style={{ color: "red" }}>{this.state.message}</p>
        </div>
      );
    } else {
      return this.renderTable();
    }
  }
}

export default ChooseLobby;
