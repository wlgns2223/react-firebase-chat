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
    searchTerm: "",
    searchResult: [],
    searchLoading: false,
  };

  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResult = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResult });
  };

  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      this.handleSearchMessages
    );
  };

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
    const { messages, searchTerm, searchResult } = this.state;
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />
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
          {searchTerm
            ? this.renderMessages(searchResult)
            : this.renderMessages(messages)}
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
