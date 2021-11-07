import React from "react";
import { useQuery, gql } from "@apollo/client";
import _ from "lodash";

const REPORT_DATA_QUERY = gql`
  query SpendingReportQuery {
    users {
      id
      name
    }
    coffee_depletion(
      where: { was_paid_for: { _eq: false }, depletor_id: { _is_null: false } }
    ) {
      coffee_bag {
        price_paid
        owner {
          name
          id
        }
        weight_in_grams
      }
      coffee_hold_type {
        grams
      }
      depletor {
        id
        name
      }
    }
  }
`;

type AmountOwed = number;
interface BinType {
  [userId: number]: { [userId: number]: AmountOwed };
}

const ReportPage = () => {
  // Queries
  const { data, loading, error } = useQuery(REPORT_DATA_QUERY);
  // Computed Values
  const binnedData = data?.coffee_depletion?.reduce(
    (acc: BinType, cur: any) => {
      const bagOwnerId = cur.coffee_bag.owner.id;
      const depletorId = cur.depletor.id;
      const curAmountOwed =
        (cur.coffee_bag.price_paid / cur.coffee_bag.weight_in_grams) *
        cur.coffee_hold_type.grams;
      if (bagOwnerId === depletorId) {
        return { ...acc };
      }
      return {
        ...acc,
        [depletorId]: {
          ...(acc[depletorId] ?? {}),
          [bagOwnerId]: (acc?.[depletorId]?.[bagOwnerId] ?? 0) + curAmountOwed,
        },
      };
    },
    {} as BinType
  );

  console.log({ binnedData });

  if (loading) {
    return "Loading...";
  }
  if (error) {
    return "Something went wrong";
  }
  return (
    <div>
      {data?.users?.map(({ id, name }: any) => (
        <div key={id}>
          <h4>
            <b>{name} owes</b>:
          </h4>
          <div style={{ marginLeft: "40px" }}>
            {binnedData?.[id]
              ? _.toPairs(binnedData?.[id]).map(([userId, amount]) => {
                  const user = data?.users.find((user: any) => {
                    return userId == user.id;
                  });
                  // @ts-ignore
                  const formattedAmount = Math.trunc(amount * 100) / 100;
                  return (
                    <p key={userId}>
                      To {user?.name}: ${formattedAmount}
                    </p>
                  );
                })
              : "Nothing"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportPage;
