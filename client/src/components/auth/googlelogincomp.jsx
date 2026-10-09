import React from "react";
import { GoogleLogin } from "@react-oauth/google";
export default function GoogleLoginComp() {
  function handleOnSuccess(credentialResponse) {
    console.log(credentialResponse);
  }
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleOnSuccess(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}
