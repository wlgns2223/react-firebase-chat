import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";

function MessageForm() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref("message");
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  const createMessage = (fileURL = null) => {
    const message = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileURL) {
      message["image"] = fileURL;
    } else {
      message["content"] = content;
    }

    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors((prevArr) => prevArr.concat("Type Contents First"));
      return null;
    }
    setLoading(true);
    try {
      await messagesRef.child(chatRoom.id).push().set(createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (e) {
      setErrors((prev) => prev.concat(e.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }

    // firebase
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            value={content}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Form>
      <ProgressBar now={60} label="60%" />
      <div>
        {errors.map((msg, index) => (
          <p key={index} style={{ color: "red" }}>
            {msg}
          </p>
        ))}
      </div>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
