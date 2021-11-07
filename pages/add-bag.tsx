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

interface Props {}

interface FormValues {
  imageUrl: string;
  roaster: string;
  roastName: string;
  roastLevel: string;
  bagCost: number;
  bagWeight: string;
  bagOwnerId: string;
}

const style = {
  width: "100%",
  margin: "10px 0",
};

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
    <div className={styles.formContainer}>
      <h2>Add Bag Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={style}>
        <label>Bag Image Url:</label>
        <br />
        <input
          type='url'
          {...register("imageUrl", { required: true })}
          style={style}
        />
        <br />
        <label>Roaster:</label>
        <br />
        <input
          type='text'
          {...register("roaster", { required: true })}
          style={style}
        />
        <br />
        <label>Roast Name:</label>
        <br />
        <input
          type='text'
          {...register("roastName", { required: true })}
          style={style}
        />
        <br />
        <label>Roast Level:</label>
        <br />
        <select
          className='selectList'
          style={style}
          {...register("roastLevel", { required: true })}
        >
          <option value='light'>Light</option>
          <option value='medium'>Medium</option>
          <option value='dark'>Dark</option>
        </select>
        <br />
        <label>
          Bag Cost: <span style={{ color: "gray" }}>(post-tax)</span>
        </label>
        <br />
        <input
          type='text'
          style={style}
          {...register("bagCost", { required: true })}
        />
        <br />
        <label>Bag Weight(grams):</label>
        <br />
        <input
          type='number'
          style={style}
          {...register("bagWeight", { required: true })}
        />
        <br />
        <label>Bag Owner</label>
        <br />
        <select style={style} {...register("bagOwnerId", { required: true })}>
          <option value='1'>Austin</option>
          <option value='2'>David</option>
        </select>
        <br />
        <br />
        <button
          type='submit'
          style={style}
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
