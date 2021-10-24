import React from "react";

interface Props {}

const RequireLogin: React.FC<Props> = (props) => {
  return <>{props.children}</>;
};

export default RequireLogin;
