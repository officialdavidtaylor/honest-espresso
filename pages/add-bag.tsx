import React from "react";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";

import styles from "./add-bag.module.css";

const AddBagMutation = gql`
  mutation InsertNewBag(
    $imageUrl: String!
    $bagOwnerId: Int!
    $bagCost: numeric!
    $roastName: String!
    $roaster: String!
    $bagWeight: Int!
    $roastLevel: String!
  ) {
    insert_coffee_bag_one(
      object: {
        image_url: $imageUrl
        roaster: $roaster
        roast_name: $roastName
        price_paid: $bagCost
        weight_in_grams: $bagWeight
        owner_user_id: $bagOwnerId
        roast_level: $roastLevel
      }
    ) {
      id
      roaster
    }
  }
`;

interface Props { }

interface FormValues {
  imageUrl: string;
  roaster: string;
  roastName: string;
  roastLevel: string;
  bagCost: number;
  bagWeight: string;
  bagOwnerId: string;
}

const AddBagPage = (props: Props) => {
  const [addBagMutation, addBagProperties] = useMutation(AddBagMutation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { roastLevel: "medium" },
  });

  const onSubmit = async (values: FormValues) => {
    await addBagMutation({ variables: values });
  };
  console.log({ addBagProperties });

  return (
    <div className={styles.container}>
      <h2 className={styles.h2Text}>Add Bag Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <label className={styles.titleText}>Bag Image Url:</label>
        <input
          type='url'
          {...register("imageUrl", { required: true })}
          className={styles.textInputBox}
        />

        <label className={styles.titleText}>Roaster:</label>
        <input
          type='text'
          {...register("roaster", { required: true })}
          className={styles.textInputBox}
        />

        <label className={styles.titleText}>Roast Name:</label>
        <input
          type='text'
          {...register("roastName", { required: true })}
          className={styles.textInputBox}
        />

        <label className={styles.titleText}>Roast Level:</label>

        <select
          className={styles.textInputBox}
          {...register("roastLevel", { required: true })}
        >
          <option value='light'>Light</option>
          <option value='medium'>Medium</option>
          <option value='dark'>Dark</option>
        </select>

        <label className={styles.titleText}>
          Bag Cost: <span style={{ color: "gray" }}>(post-tax)</span>
        </label>

        <input
          type='text'
          className={styles.textInputBox}
          {...register("bagCost", { required: true })}
        />

        <label className={styles.titleText}>Bag Weight (grams):</label>

        <input
          type='number'
          className={styles.textInputBox}
          {...register("bagWeight", { required: true })}
        />

        <label className={styles.titleText}>Bag Owner</label>

        <select
          className={styles.textInputBox}
          {...register("bagOwnerId",
            { required: true })}
        >
          <option value='1'>Austin</option>
          <option value='2'>David</option>
        </select>


        <button
          type='submit'
          className={styles.buttonStyle}
          disabled={addBagProperties.loading || addBagProperties.called}
        >
          {addBagProperties.loading ? "Loading..." : "Add Bag"}
        </button>
      </form>
      {Object.values(errors).reduce(
        (acc: any, cur) => (acc ? acc : cur ? cur : null),
        null
      ) &&
        addBagProperties.error && (
          <p style={{ color: "red" }}>Something went wrong :(</p>
        )}
    </div>
  );
};

export default AddBagPage;
