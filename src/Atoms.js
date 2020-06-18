
import React from "react";
import './App.css';

function Shortcut(props) {
    return (
    <span className={'font-mono ml-1 px-1 border border-gray-700 bg-gray-800 text-white rounded-sm'}>ctrl<span className={'pl-1'}>{props.children}</span></span>
    )
}

function Button(props) {
    return (
      <button {...props} className={`text-xs px-2 py-1 bg-opacity-75 text-white cursor-pointer focus:outline-none hover:bg-gray-700 hover:text-gray-100 ${props.hidden ? 'hidden' : ''}`}>
        {props.children}
      </button>
    );
  }

export { Shortcut, Button }