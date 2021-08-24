import React, { useRef } from "react";
import { IoIosChatboxes } from "react-icons/io";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../../firebase";
import mime from "mime-types";
import { setPhotoURL } from "../../../redux/actions/userAction";

function UserPanel() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const inputOpenImageRef = useRef();
  const handleImageOpenRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleLogOut = () => {
    firebase.auth().signOut();
  };

  const onClickUploadImage = async (e) => {
    const file = e.target.files[0];

    const metaData = { contentType: mime.lookup(file.name) };

    // 스토리지에 파일저장
    try {
      let uploadTaskSnapShot = await firebase
        .storage()
        .ref()
        .child(`user_img/${currentUser.uid}`)
        .put(file, metaData);

      const downloadURL = await uploadTaskSnapShot.ref.getDownloadURL();

      // firebase profile image 수정
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL,
      });

      // DB 유저 이미지 수정
      await firebase
        .database()
        .ref("users")
        .child(currentUser.uid)
        .update({ image: downloadURL });

      // 리덕스 유저 이미지 URL 수정
      dispatch(setPhotoURL(downloadURL));
    } catch (e) {
      alert(e);
    }
  };

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
            <Dropdown.Item onClick={handleImageOpenRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogOut}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input
          onChange={onClickUploadImage}
          accept="image/jpeg, image/png"
          type="file"
          ref={inputOpenImageRef}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

export default UserPanel;
