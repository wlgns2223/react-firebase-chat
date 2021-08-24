import React from "react";
import { IoIosChatboxes } from "react-icons/io";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useSelector } from "react-redux";

function UserPanel() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <div>
      <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3>
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          style={{ width: "30px", height: "30px", marginTop: "3px" }}
          src={currentUser && currentUser.photoURL}
          roundedCircle
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: "transparent", border: "none" }}
            id="dropdown-basic"
          >
            {currentUser && currentUser.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item href="#/action-2">로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
