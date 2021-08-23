import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
  };
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Log In</h3>
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
        <input value="LOG IN" type="submit" disabled={loading} />
        <Link style={{ color: "gray", textDecoration: "none" }} to="/register">
          아직 아이디가 없다면?
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
