import React, { Component } from "react";
import UserPanel from "./UserPanel";
import FavoritedPanel from "./FavoritedPanel";
import DirectMessages from "./DirectMessages";
import Chatrooms from "./Chatrooms";

export class SidePanel extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "#7B83EB",
          padding: "2rem",
          minHeight: "100vh",
          color: "white",
          minWidth: "275px",
        }}
      >
        <UserPanel />
        <FavoritedPanel />
        <Chatrooms />
        <DirectMessages />
      </div>
    );
  }
}

export default SidePanel;
