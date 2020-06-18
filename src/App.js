import React from 'react';
import './App.css';
import ContentEditable from "react-contenteditable";

import { Button, Shortcut } from "../src/Atoms";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = {
      colOne: window.localStorage.getItem("colOne") || "",
      colTwo: window.localStorage.getItem("colTwo") || "",
      fullScreen: false,
    };
  }

  componentDidMount() {
    document.getElementById("colOne").focus();

    let keysPressed = {};
    document.addEventListener('keydown', (event) => {
      keysPressed[event.key] = true;
      if (keysPressed['Control'] && keysPressed['Enter']) {
          this.insertCol();
      }
      if (keysPressed['Control'] && keysPressed[`\\`]) {
          this.resize();
      }
      if (keysPressed['Control'] && keysPressed[`/`]) {
          this.displayShortcuts();
      }
      if (keysPressed['Control'] && keysPressed[`'`]) {
          this.appendCol();
      }
    });
    document.addEventListener('keyup', (event) => {
      keysPressed={}
    });
  }
  displayShortcuts() {
    let shortcuts = ` 
      Shortcuts<br/>
      - Insert (add on top)........<b>control enter</b><br/>
      - Append (add on bottom).....<b>control '</b><br/>
      - Expand/collapse............<b>control \\</b><br/>
      - Switch columns.............<b>tab, shift tab</b><br/><br/>
      ** Release the control key between shortcuts!
      ` ;
    this.setState({ colOne: this.state.colOne + (this.state.colOne !== "" ? `<br/><br/>` : ``) + shortcuts });
    document.getElementById("colOne").focus()
  }

  setColOne = evt => {
    localStorage.setItem("colOne", evt.target.value);
    this.setState({ colOne: evt.target.value });
  };

  setColTwo = evt => {
    localStorage.setItem("colTwo", evt.target.value);
    this.setState({ colTwo: evt.target.value });
  };

  insertCol() {
    let combined = null;
    if (this.state.colOne === "") {
      combined = `---<br/><br/>` + window.localStorage.getItem('colTwo');
    }
    else combined = window.localStorage.getItem('colOne') + `<br/><br/>---<br/><br/>` +  window.localStorage.getItem('colTwo');
    return (
      this.setState({ colTwo: combined}),
      this.setState({ colOne: ""}),
      localStorage.setItem("colOne", ""),
      localStorage.setItem("colTwo", combined),
      document.getElementById("colTwo").scrollTo(0,0),
      document.getElementById("colOne").focus()
    )
  }
  
  appendCol() {
    let combined = null;
    if (this.state.colOne === "") {
      combined = window.localStorage.getItem('colTwo') + `<br/><br/>---`;
    }
    else if (this.state.colTwo === "") {
      combined = window.localStorage.getItem('colOne');
    }
    else combined = window.localStorage.getItem('colTwo') + `<br/>` + window.localStorage.getItem('colOne');
    return (
      this.setState({ colTwo: combined}),
      this.setState({ colOne: ""}),
      localStorage.setItem("colOne", ""),
      localStorage.setItem("colTwo", combined),
      document.getElementById("colTwo").scrollTo(0, document.getElementById("colTwo").scrollHeight+1000),
      document.getElementById("colOne").focus()
    )
  }

  resize() {
    this.setState({ fullScreen: !this.state.fullScreen});
    document.getElementById("colOne").focus()
  }

  render = () => {
    return (
      <div className={"flex-col h-screen relative"}>
        <div className={'w-full flex bg-gray-900 shadow-inner h-8 absolute bottom-0 sm:static sm:top-0 noprint'}>
          <div className={'w-1/2 flex justify-start'}>
            <Button
              hidden={this.state.colOne === "" ? false : true}
              onClick={() => this.displayShortcuts()}>
              Shortcuts <Shortcut>/</Shortcut>
            </Button>
            <Button
              hidden={this.state.colOne === "" ? true : false}
              onClick={() => this.insertCol()}>
              Insert <Shortcut>&#x21b2;</Shortcut>
            </Button>
            <Button
              hidden={this.state.colOne === "" ? true : false}
              onClick={() => this.appendCol()}>
              Append <Shortcut>'</Shortcut>
            </Button>
          </div>
          <div className={'w-1/3 flex justify-center self-center hidden'}>
            <div className={'font-black text-teal-300 uppercase italic text-sm'}>Scraps</div>
          </div>
          <div className={'w-1/2 flex justify-end'}>
            <Button
              onClick={() => this.resize()}>
              {this.state.fullScreen ? 'Expand' : 'Collapse'} <Shortcut>\</Shortcut>
            </Button>
          </div>
        </div>
        <div className={`grid ${this.state.fullScreen ? `grid-cols-1` : `grid-cols-2`} bg-gray-300 bg-opacity-25 divide-x divide-gray-400`}>
          <div className={`overflow-y-auto flex-grow-0 text-black`}>
            <ContentEditable
              id={"colOne"}
              html={this.state.colOne}
              disabled={false}
              onChange={this.setColOne}
              className={"h-screen overflow-y-auto focus:bg-white text-sm font-mono outline-none px-4 py-12 -mt-8"}
            />
          </div>
          <div className={`overflow-y-auto flex-grow-0 text-black ${this.state.fullScreen && `hidden`}`}>
            <ContentEditable
              id={"colTwo"}
              html={this.state.colTwo}
              disabled={false}
              onChange={this.setColTwo}
              className={"h-screen overflow-y-auto focus:bg-white text-sm font-mono outline-none px-4 py-12 -mt-8"}
            />
          </div>
          
        </div>
      </div>
    );
  };
}

export default App;
