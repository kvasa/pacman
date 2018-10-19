import React, { Component } from "react";
import Game from "./game/Game";

// styles
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.game = new Game();
  }

  saveRef = canvas => {
    if (canvas) {
      this.game.init(canvas);
    }
  };

  render() {
    return (
      <div className="App">
        <canvas ref={this.saveRef} width={672} height={768} />
      </div>
    );
  }
}

export default App;
