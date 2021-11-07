import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import _ from "lodash";

import styles from "./refill.module.css";
import { useForm } from "react-hook-form";

interface Props {}

// Queries
const GET_NONEMPTY_BAGS_QUERY = gql`
  query GetBags {
    coffee_bag(where: { is_bag_empty: { _eq: false } }) {
      id
      roast_name
      roaster
      roast_level
      weight_in_grams
      coffee_used
      is_bag_empty
    }
  }
`;
const GET_TIN_INFO_BY_ID = gql`
  query GetTinInfoById($tinId: Int!) {
    tin_by_pk(id: $tinId) {
      id
      volumn_oz
      coffee_depletion {
        id
        depletor {
          name
        }
      }
    }
  }
`;
const GET_HOLD_TYPES = gql`
  query GetHoldTypes {
    coffee_hold_type {
      id
      grams
      type
    }
  }
`;

// Mutations
const CREATE_DEPLETION_MUTATION = gql`
  mutation CreateDepletion($bagId: Int!, $coffeHoldId: Int!) {
    insert_coffee_depletion_one(
      object: { coffee_bag_id: $bagId, coffee_hold_type_id: $coffeHoldId }
    ) {
      id
      tin {
        id
        volumn_oz
      }
      coffee_bag {
        id
        roast_name
        roast_name
      }
    }
  }
`;
const REFILL_TIN_MUTATION = gql`
  mutation RefillTin($tinId: Int!, $depletionId: Int!) {
    update_tin_by_pk(
      pk_columns: { id: $tinId }
      _set: { coffee_depletion_id: $depletionId }
    ) {
      id
      coffee_depletion {
        tin {
          id
        }
      }
    }
  }
`;

interface FormValueTypes {
  bagId: number;
  holdType: number;
}

const RefillTinById = (props: Props) => {
  const router = useRouter();

  const tinId = parseInt((router.query.tinId as string) ?? "");

  // Data Fetching
  const availableBags = useQuery(GET_NONEMPTY_BAGS_QUERY);
  const tinInfo = useQuery(GET_TIN_INFO_BY_ID, {
    variables: { tinId: router.query.tinId },
  });
  const coffeeHoldTypes = useQuery(GET_HOLD_TYPES);

  // Mutations
  const [createDepletion, createDepletionProperties] = useMutation(
    CREATE_DEPLETION_MUTATION
  );
  const [refillTin, refillTinProperties] = useMutation(REFILL_TIN_MUTATION);

  // Form Hook
  const { register, handleSubmit } = useForm<FormValueTypes>();

  // Computed Values
  const doesHaveCoffeeInTin = !_.get(
    tinInfo,
    "data.tin_by_pk.coffee_depletion.depletor.name",
    false
  );

  // Functions
  const onSubmit = async (values: FormValueTypes) => {
    console.log({ values });
    const createDepletionResponse = await createDepletion({
      variables: { bagId: values.bagId, coffeHoldId: values.holdType },
    });
    if (createDepletionResponse.errors) {
      alert("Something went wrong :(. Please try again");
      return;
    }
    const depletionId = createDepletionResponse.data
      ?.insert_coffee_depletion_one?.id as Number;
    await refillTin({ variables: { tinId, depletionId } });
  };

  if (
    !router.query.tinId ||
    !_.isNumber(parseInt(router.query.tinId as string))
  ) {
    return "There is no tin id set";
  }

  if (tinInfo.loading || availableBags.loading || coffeeHoldTypes.loading) {
    return "Loading.....";
  }
  if (tinInfo.error || availableBags.error || coffeeHoldTypes.error) {
    return "Something went wrong :(";
  }
  return (
    <div className={styles.container}>
      <h1>Refill Tin</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <select
          className={styles.selectBox}
          {...register("bagId", { required: true })}
        >
          <option value='' selected disabled hidden>
            Choose Bag
          </option>
          {availableBags.data.coffee_bag.map(
            ({ id, roast_name, roaster }: any) => (
              <option key={id} value={id}>{`${roaster}-${roast_name}`}</option>
            )
          )}
        </select>
        <br />
        <select
          className={styles.selectBox}
          {...register("holdType", { required: true })}
        >
          <option value='' selected disabled hidden>
            Choose Hold type
          </option>
          {_.get(coffeeHoldTypes, "data.coffee_hold_type", []).map(
            ({ id, type }: any) => (
              <option value={id} key={id}>
                {type}
              </option>
            )
          )}
        </select>
        <button className={styles.button} disabled={doesHaveCoffeeInTin}>
          {!doesHaveCoffeeInTin ? "Refill Tin" : "Tin Full"}
        </button>
      </form>
    </div>
  );
};

export default RefillTinById;
