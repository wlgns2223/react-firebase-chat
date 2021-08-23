import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import md5 from "md5";
import firebase from "../../firebase";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState(null);
  const [loading, setLoading] = useState(false);

  // useRef로 DOM말고 변수로써도 만들 수 있음.
  const password = useRef();
  password.current = watch("password");
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      await createdUser.user.updateProfile({
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      // firebase 데이터베이스 저장
      await firebase.database().ref("users").child(createdUser.user.uid).set({
        displayName: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      setLoading(false);
    } catch (e) {
      setErrorFromSubmit(e.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>REGISTER</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          defaultValue="test"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <span>이메일을 입력해주세요</span>}
        <label>Name</label>
        <input
          name="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This name field is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Your Input exceeds maxLength</p>
        )}
        <label>Password</label>
        <input
          name="password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This Password field is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Password must have at least 6 characters</p>
        )}
        <label>Password Confirm</label>
        <input
          name="passwordConfirm"
          type="password"
          {...register("passwordConfirm", {
            validate: (value) => value === password.current,
          })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This Password field is required</p>
        )}
        {errors.name && errors.name.type === "validate" && (
          <p>The Password do not match</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input value="SUBMIT" type="submit" disabled={loading} />
        <Link style={{ color: "gray", textDecoration: "none" }} to="/login">
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
