import { useRouter } from "next/router";
import React from "react";

interface Props {}

const RequireLogin: React.FC<Props> = (props) => {
  const router = useRouter();
  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert(
        "You must register first. You will be redirected to the register page. Please rescan your QR code once signed in."
      );
      router.replace("/register");
    }
  }, []);
  return <>{props.children}</>;
};

export default RequireLogin;
