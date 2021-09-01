import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSelector, useStore } from "react-redux";
import firebase from "../../../firebase";

function MessageHeader({ handleSearchChange }) {
  const { currentChatRoom, isPrivateChatRoom } = useSelector(
    (state) => state.chatRoom
  );
  const user = useSelector((state) => state.user.currentUser);
  const [isFavorited, setIsFavorited] = useState(false);
  const userRef = firebase.database().ref("user");

  const handleFavorite = () => {
    if (isFavorited) {
      userRef
        .child(`${user.uid}/favorited`)
        .child(currentChatRoom.id)
        .remove((error) => {
          if (error !== null) {
            console.error(error);
          }
        });
      setIsFavorited((state) => !state);
    } else {
      userRef.child(`${user.uid}/favorited`).update({
        [currentChatRoom.id]: {
          name: currentChatRoom.name,
          description: currentChatRoom.description,
          createdBy: {
            name: currentChatRoom.createdBy.name,
            image: currentChatRoom.createdBy.image,
          },
        },
      });
      setIsFavorited((state) => !state);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "170px",
        border: "0.2rem solid #ececec",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              {isPrivateChatRoom ? (
                <FaLock style={{ marginRight: "10px" }} />
              ) : (
                <FaLockOpen style={{ marginRight: "10px" }} />
              )}
              {currentChatRoom && currentChatRoom.name}{" "}
              {!isPrivateChatRoom && (
                <span style={{ cursor: "pointer" }} onClick={handleFavorite}>
                  {isFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
                </span>
              )}
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
                onChange={handleSearchChange}
                placeholder="Search Message"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <p>
            <Image src="" />
            User Name
          </p>
        </div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0 1rem" }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Header
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0 1rem" }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Header
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
