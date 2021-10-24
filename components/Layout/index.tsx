import React from "react";
import styles from "./layout.module.css";

interface Props {}

const Layout: React.FC<Props> = (props) => {
  return <main className={styles.container}>{props.children}</main>;
};

export default Layout;
