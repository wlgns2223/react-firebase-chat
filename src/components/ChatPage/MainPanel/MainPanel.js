import React, { Component } from "react";
import Message from "./Message";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import firebase from "../../../firebase";

export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: firebase.database().ref("message"),
    messageLoading: true,
  };

  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  addMessagesListeners = (chatRoomId) => {
    let messageArray = [];
    this.state.messagesRef
      .child(chatRoomId)
      .on("child_added", (DataSnapshot) => {
        messageArray.push(DataSnapshot.val());
        this.setState({ messages: messageArray, messageLoading: false });
      });
  };

  renderMessages = (messages) => {
    if (messages.length) {
      return messages.map((message) => (
        <Message
          key={message.timeStamp}
          message={message}
          user={this.props.user}
        />
      ));
    }
  };

  render() {
    const { messages } = this.state;
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader />
        <div
          style={{
            width: "100%",
            height: "450px",
            border: "0.2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {this.renderMessages(messages)}
        </div>
        <MessageForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};

export default connect(mapStateToProps)(MainPanel);
