import React from "react";
import "./Home.css";
import Login from "./Windows/Login";
import Register from "./Windows/Register";
import MainMenu from "./Windows/MainMenu";

import PlayerAvatar from "./Components/PlayerAvatar";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 0, //0 - home screen//1 - login screen//2 - register screen//3 - main menu screen//4 - development
      host: "http://localhost:3001",
      __token: "",
      __dev: true
    };

    this.setView = this.setView.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.goToRegister = this.goToRegister.bind(this);
    this.goToHome = this.goToHome.bind(this);
    this.goToAbout = this.goToAbout.bind(this);
    this.goToHow = this.goToHow.bind(this);
    this.goToTerms = this.goToTerms.bind(this);
    this.goToPrivacy = this.goToPrivacy.bind(this);
    this.__setToken = this.__setToken.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  __setToken(token) {
    this.setState({ __token: token });
  }

  setView(p_view) {
    this.setState({ view: p_view });
  }

  goToLogin() {
    this.setView(1);
  }

  goToRegister() {
    this.setView(2);
  }

  goToHome(){
    this.setView(0);
  }

  goToAbout(){
    this.setView(0);
  }

  goToHow(){
    this.setView(0);
  }

  goToTerms(){
    this.setView(0);
  }

  goToPrivacy(){
    this.setView(0);
  }

  renderScreen() {
    switch (this.state.view) {
      case 0: //home screen/pre-login
        return (
          <div className = "homeContainer">
          <h1 > Welcome to Straight10! </h1>
            <button className = "home" onClick={this.goToLogin}> LOGIN </button>
            <button className = "home" onClick={this.goToRegister}> REGISTER </button>
          </div>
        );
      case 1: //Login screen
        return (
          <Login
            setView={this.setView}
            host={this.state.host}
            __setToken={this.__setToken}
            __dev={this.state.__dev}
          />
        );
      case 2: //Register screen
        return <Register setView={this.setView} host={this.state.host} />;
      case 3: //home screen/post login
        return (
          <MainMenu
            setView={this.setView}
            host={this.state.host}
            __dev={this.state.__dev}
            __token={this.state.__token}
          />
        );
      case 4:
        return (
          <PlayerAvatar
            is_current_player={true}
            username="yeet"
            player_id="0"
            num_cards="4"
            cards={[{ s: 0, r: 0 }, { s: 1, r: 0 }, { s: 2, r: 0 }]}
          />
        );
      default:
        return <h1> You are not supposed to be here...</h1>;
    }
  }

  render(){
    return(
      <React.Fragment>
      <div>{this.renderScreen()}</div>
      <div className = "footer">
          <button onClick={this.goToAbout}>
            Home
          </button>|
          <button onClick={this.goToAbout}>
            About
          </button>|
          <button onClick={this.goToHow}>
            How to play
          </button>|
          <button onClick={this.goToTerms}>
            Terms of service
          </button>|
          <button onClick={this.goToPrivacy}>
            Privacy policy
          </button>
      </div>
      </React.Fragment>
    )
  }
}

export default Home;
