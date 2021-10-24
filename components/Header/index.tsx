import React from "react";
import styles from "../header.module.css";

interface Props {}

const Header: React.FC<Props> = () => {
  return <div className={styles.container}></div>;
};

export default Header;
