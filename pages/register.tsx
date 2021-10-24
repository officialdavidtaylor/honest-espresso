import React from "react";
import { users } from "../data";

import styles from "./register.module.css";

interface Props {}

const Register = (props: Props) => {
  const [user, setUser] = React.useState<null | {
    userId: number;
    userName: string;
  }>(null);

  const [newUserId, setNewUserId] = React.useState<Number>(users[0].id);

  const onSubmit = (event: any) => {
    event.preventDefault();
    const newUserInfo = users.find((user) => user.id === newUserId);
    const userIdString = newUserInfo ? newUserInfo.id.toString() : null;
    localStorage.setItem("userName", newUserInfo?.name || "");
    localStorage.setItem("userId", userIdString ?? "");
    setUser({
      userId: newUserInfo?.id ?? 0,
      userName: newUserInfo?.name || "",
    });
  };

  const onChange = (event: any) => {
    setNewUserId(parseInt(event.target.value));
  };

  React.useEffect(() => {
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    if (userName && userId) {
      setUser({
        userName,
        userId: parseInt(userId, 10),
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      {user ? (
        <p>
          Currently signed in as: <b>{user.userName}</b>
        </p>
      ) : (
        <p>Please Select a user to sign in as</p>
      )}
      <form onSubmit={onSubmit}>
        <select name='user' onChange={onChange} defaultValue={users[0].id}>
          {users.map(({ id, name }) => (
            <option value={id} key={id}>
              {name}
            </option>
          ))}
        </select>
        <button type='submit'>Change User</button>
      </form>
    </div>
  );
};

export default Register;
