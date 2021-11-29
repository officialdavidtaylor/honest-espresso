import React from "react";
import styles from "./loading.module.css";

const Loading = (props) => {

  let visibility = (props.visibility ? 'visible' : 'hidden');

  return (
    <div style={{ visibility }} className={styles.loadingContainer}>
      <div className={styles.coffeeMug}>
        <div className={styles.coffeeContainer}>
          <div className={styles.coffee}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;