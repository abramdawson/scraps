import React from 'react';
import './App.css';
import ContentEditable from "react-contenteditable";

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
      =====<br>
      <b>Insert (add on top)</b>: control enter<br/>
      <b>Append (add on bottom)</b>: control '<br/>
      <b>Expand/collapse</b>: control .<br/>
      <b>Focus right</b>: tab<br/>
      <b>Focus left</b>: shift tab
      ` ;
    if (window.localStorage.getItem('colOne') === "") {
      this.setState({ colOne: shortcuts });
      document.getElementById("colOne").focus()
    }
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
        <div className={'w-full flex justify-between bg-gray-900 h-8 noprint'}>
          <div className={'flex'}>
            <button
              className={`text-xs px-2 py-1 bg-opacity-75 text-white cursor-pointer focus:outline-none hover:bg-gray-800 hover:text-gray-100 ${this.state.colOne === "" ? `` : `hidden`}`}
              onClick={() => this.displayShortcuts()}>
              Shortcuts
              <span className={'font-mono ml-1 px-1 border border-gray-700 bg-gray-800 text-gray-200 rounded-sm'}>ctrl<span className={'pl-1'}>/</span></span>
            </button>
            <button
              className={`text-xs px-2 py-1 bg-opacity-75 text-white cursor-pointer focus:outline-none hover:bg-gray-800 hover:text-gray-100 ${this.state.colOne === "" ? `hidden` : ``}`}
              onClick={() => this.insertCol()}>
              Insert
              <span className={'font-mono ml-1 px-1 border border-gray-700 bg-gray-800 text-gray-200 rounded-sm'}>ctrl<span className={'pl-1'}>&#x21b2;</span></span>
            </button>
            <button
              className={`text-xs px-2 py-1 bg-opacity-75 text-white cursor-pointer focus:outline-none hover:bg-gray-800 hover:text-gray-100 ${this.state.colOne === "" ? `hidden` : ` `}`}
              onClick={() => this.appendCol()}>
              Append
              <span className={'font-mono ml-1 px-1 border border-gray-700 bg-gray-800 text-gray-200 rounded-sm'}>ctrl<span className={'pl-1'}>'</span></span>
            </button>
          </div>
          <div className={'flex'}>
            <button
              className={`text-xs px-2 py-1 bg-opacity-75 text-white cursor-pointer focus:outline-none hover:bg-gray-800 hover:text-gray-100`}
              onClick={() => this.resize()}>
                {this.state.fullScreen ? <span>Expand</span> : <span>Collapse</span>}
                <span className={'font-mono ml-1 px-1 border border-gray-700 bg-gray-800 text-gray-200 rounded-sm'}>ctrl<span className={'pl-1'}>\</span></span>
            </button>
          </div>
        </div>
        <div className={`grid ${this.state.fullScreen ? `grid-cols-1` : `grid-cols-2`} bg-gray-300 bg-opacity-25 divide-x divide-gray-400`}>
          <div className={`overflow-y-auto flex-grow-0`}>
            <ContentEditable
              id={"colOne"}
              html={this.state.colOne}
              disabled={false}
              onChange={this.setColOne}
              className={"h-screen overflow-y-auto focus:bg-white text-sm font-mono outline-none px-4 py-12 -mt-8"}
            />
          </div>
          <div className={`overflow-y-auto flex-grow-0 ${this.state.fullScreen && `hidden`}`}>
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
