import type { NextPage } from "next";
import Link from "next/link";

import styles from "./index.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Link href='/report' passHref>
        <a className={styles.linkStyle}>
          <div className={styles.buttonStyle}>Report</div>
        </a>
      </Link>
      <Link href='/add-bag' passHref>
        <a className={styles.linkStyle}>
          <div className={styles.buttonStyle}>Add Bag</div>
        </a>
      </Link>
      <Link href='/refill-tins' passHref>
        <a className={styles.linkStyle}>
          <div className={styles.buttonStyle}>Refill Tins</div>
        </a>
      </Link>
      <Link href='/register' passHref>
        <a className={styles.linkStyle}>
          <div className={styles.buttonStyle}>Register</div>
        </a>
      </Link>
    </div>
  );
};

export default Home;
