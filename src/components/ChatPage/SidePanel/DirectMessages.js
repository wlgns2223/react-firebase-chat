import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoomAction";

export class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("users"),
    users: [],
    activeChatRoom: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid);
    }
  }

  addUsersListeners = (myUID) => {
    const { usersRef } = this.state;
    let usersArray = [];
    usersRef.on("child_added", (DataSnapshot) => {
      if (myUID !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline";
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  };

  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;
    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  openDirectMessageRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.displayName,
    };
    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };

  setActiveChatRoom = (userID) => {
    this.setState({ activeChatRoom: userID });
  };

  handleDirectMessages = (users) => {
    if (users.length > 0) {
      return users.map((user) => (
        <li
          onClick={() => this.openDirectMessageRoom(user)}
          style={{
            cursor: "pointer",
            backgroundColor:
              user.uid === this.state.activeChatRoom && "#ffffff45",
          }}
          key={user.uid}
        >{`# ${user.displayName}`}</li>
      ));
    }
  };

  render() {
    const { users } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaRegSmile style={{ marginRight: "3px" }} /> DIRECT MESSAGE(1)
        </span>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {this.handleDirectMessages(users)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
