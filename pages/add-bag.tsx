import React from "react";

import styles from "./add-bag.module.css";

interface Props { }

const AddBagPage = (props: Props) => {
  return (
    <div className={styles.formContainer}>
      <form>
        <label>Roaster:</label><br />
        <input type="text" name="roaster" /><br />

        <label>Roast Name:</label><br />
        <input type="text" name="roastName" /><br />

        <label>Roast Level:</label><br />
        <select className="selectList" name="roastLevel">
          <option>Medium</option>
          <option>Light</option>
          <option>Dark</option>
        </select><br />

        <label>Shot Weight (g):</label><br />
        <input type="text" name="shotWeight" defaultValue="17.0" /><br />

        <label>Bag Cost: <span style={{ color: "gray" }}>(post-tax)</span></label><br />
        <input className={styles.bagCost} type="text" name="bagCost" pattern="^\d|\d+.|\d+(.\d{1,2})?$" /><br />

        <label>Shot Prep Notes:</label><br />
        <input type="text" name="prepNotes" /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddBagPage;
