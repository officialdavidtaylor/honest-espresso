import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";

import styles from "./refill.module.css";

interface Props { }

// TODO: Need tinId variable

// Available coffee logic
let activeCoffee = ['testRoastName1', 'testReallyLongName2', 'testRoastName3']
// TODO: Austin please connect the activeCoffee array to the backend
// TODO: I think we might need to have a "is this bag empty?" type of button? We can discuss later.
let availableCoffeeList = activeCoffee.map((coffee) => (<option>{coffee}</option>));

// TODO: Austin please check the logic below - I just adapted it from the Claim page
// Refill Tin Logic
// const [isFilled, setIsFilled] = React.useState(false);
// const onClaimShot = async () => {
//   await refillShotMutation(); // TODO: Austin I need you to build this part lol
//   setIsFilled(true);
// };

let isFilled = false;

const RefillTinById = (props: Props) => {
  return (
    <div className={styles.container}>
      <h1>Refill Tin</h1>
      <form className={styles.formContainer}>
        <select className={styles.selectBox} name="roastName">
          <option value="" selected disabled hidden>Choose Roast</option>
          {availableCoffeeList}
        </select>
        <br />
        <button className={styles.button} disabled={isFilled}>{!isFilled ? "Refill Tin" : "Tin Full"}</button>
      </form>
    </div>

  );
};

export default RefillTinById;
