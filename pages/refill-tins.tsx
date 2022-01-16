import React from "react";
import { users } from "../data";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import RequireLogin from "../components/RequireLogin";
import _ from "lodash";
import Loading from "../components/LoadingAnimation/Loading";
import { useRouter } from "next/router";

import { testData } from './testData.js';

import styles from "./refill-tins.module.css";
import selectStyles from "./refill/refill.module.css";

// Queries
// FIXME: This doesn't work - need Austin's blessing and help
const GET_EMPTY_TINS_QUERY = gql`
  query GetTins {
    tin (where: {coffee_depletion: {depletor: {}}}){
      id
      coffee_depletion_id
    }
  }
`;
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

// Interfaces
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

interface FormValueTypes {
  tinIds: any;
  bagId: number;
  holdType: number;
}

interface CheckboxProps {
  typeReg: any;
  name: string;
  formId?: string;
}

// Variables
let loadingAnimation = false;

const RefillTins = (props: Props) => {
  const router = useRouter();

  const tinId = parseInt((router.query.tinId as string) ?? "");

  // Queries
  const availableBags = useQuery(GET_NONEMPTY_BAGS_QUERY);
  const availableTins = useQuery(GET_EMPTY_TINS_QUERY);
  const coffeeHoldTypes = useQuery(GET_HOLD_TYPES);
  const tinInfo = useQuery(GET_TIN_INFO_BY_ID, {
    variables: { tinId: 2 },
  });

  // Form Hook
  const { register, handleSubmit } = useForm<FormValueTypes>();

  const [user, setUser] = React.useState<null | {
    userId: Number;
    userName: String;
  }>(null);

  // Claim Shot Logic
  // FIXME: Should this be a function instead?
  const claimShotMutation = (prop => useMutation(
    gql`
      mutation ClaimShot($depletionId: Int!, $userId: Int!) {
        update_coffee_depletion_by_pk(
          pk_columns: { id: $depletionId }
          _set: { depletor_id: $userId }
        ) {
          id
        }
      }
    `,
    {
      variables: {
        depletionId: prop,
        userId: user?.userId,
      },
    }
  ));

  const onSubmit = async (values: FormValueTypes) => {
    // find the weight based on the holdType selected by the user
    let perTinWeight = coffeeHoldTypes.data.coffee_hold_type.find(({ id }) => id = values.holdType).grams;
    let coffeeWeight = ((values.tinIds.length) * perTinWeight);

    let totalBagWeight = availableBags.data.coffee_bag.find(({ id }) => id = values.bagId).weight_in_grams;
    let usedBagWeight = availableBags.data.coffee_bag.find(({ id }) => id = values.bagId).coffee_used;
    let remainingBagWeight = (totalBagWeight - usedBagWeight)

    alert("This feature is still under development :)")
    // FIXME: Need to ensure the mutations are executed correctly and errors and handled intelligently
    //        --basically need to find the depletion ID based on the current selected tins
    // if (remainingBagWeight > coffeeWeight) {
    //   values.tinIds.map((tin) => {
    //     claimShotMutation(tin.coffee_depletion_id)
    //   });
    // } else {
    //   alert("Warning: There is not enough coffee left in this bag to fill all of the tins you selected!")
    // };
  };

  // Computed Values
  const doesHaveCoffeeInTin = !_.get(
    tinInfo,
    "data.tin_by_pk.coffee_depletion.depletor.name",
    false
  );

  if (tinInfo.loading || availableBags.loading || coffeeHoldTypes.loading) {
    return <Loading visibility={true} />;
  }
  if (availableBags.error || coffeeHoldTypes.error) {
    return "Something went wrong :(";
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1Text}>Bulk Refill Tins</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        {/* Checkboxes for all the available tins */}
        {availableTins.data.tin.map((tin) => {
          return (
            <InputCheckbox typeReg={register} name={tin.id} formId='tinList' />
          );
        })}
        <select
          className={selectStyles.selectBox}
          {...register("bagId", { required: true })}
        >
          <option value='' selected disabled hidden>
            Choose Bag
          </option>
          {availableBags.data.coffee_bag.map(
            ({ id, roast_name, roaster }: any) => (
              <option key={id} value={id}>{`${roaster} - ${roast_name}`}</option>
            )
          )}
        </select>
        <br />
        <select
          className={selectStyles.selectBox}
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

        {/* Submit Button */}
        {/* TODO: Ensure that there is enough coffee in virtual bag to fill all tins *on select* of each new tin card, and block if not enough */}
        <input className={styles.submitButton} type='submit' value='Submit' />
      </form>
    </div>
  );
};

function InputCheckbox(props: CheckboxProps) {

  return (
    <label className={styles.checkboxContainer}>
      <input
        type='checkbox'
        name={props.name}
        id={props.formId}
        value={props.name}
        className={styles.checkboxBox}
        {...props.typeReg('tinIds')}
      />
      <div className={styles.checkboxCard}>{props.name}</div>
    </label>
  );
}

export default RefillTins;
