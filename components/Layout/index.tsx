import React from "react";
import Header from "../Header";
import styles from "./layout.module.css";

interface Props {}

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <Header />
      <main className={styles.container}>{props.children}</main>;
    </>
  )
};

export default Layout;
