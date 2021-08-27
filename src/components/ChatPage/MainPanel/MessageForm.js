import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";
import mime from "mime-types";

function MessageForm() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref("message");
  const [percentage, setPercentage] = useState(0);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const inputOpenRef = useRef();
  const storageRef = firebase.storage().ref();

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
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleOpenImageRef = () => {
    inputOpenRef.current.click();
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const filePath = `/message/public/${file.name}`;
    const metaData = { contentType: mime.lookup(file.name) };
    setLoading(true);
    let uploadTask = storageRef.child(filePath).put(file, metaData);

    // Get Percentage
    uploadTask.on(
      "state_changed",
      (UploadTaskSnapshot) => {
        const percentage = Math.round(
          (UploadTaskSnapshot.bytesTransferred /
            UploadTaskSnapshot.totalBytes) *
            100
        );
        setPercentage(percentage);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
      // 저장된 파일을 다운받을 수 있는 URL가져오기
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);
          messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL));
          setLoading(false);
        });
      }
    );
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
      {percentage > 0 && percentage < 100 && (
        <ProgressBar now={60} label={`${percentage}%`} now={percentage} />
      )}

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
            disabled={loading ? true : false}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            onClick={handleOpenImageRef}
            className="message-form-button"
            style={{ width: "100%" }}
            disabled={loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
      <input
        accept="image/jpg, image/png"
        onChange={handleUploadImage}
        ref={inputOpenRef}
        style={{ display: "none" }}
        type="file"
      />
    </div>
  );
}

export default MessageForm;
