/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";

interface Props {}

const ClaimPage = (props: Props) => {
  // Parse Beans Info
  const router = useRouter();
  const tinId = router.query.tinId;
  const { data, error, loading } = useQuery(
    gql`
      query GetTinById($tinId: Int!) {
        tin: tin_by_pk(id: $tinId) {
          id
          coffee_depletion {
            id
            isUsed
            coffee_bag {
              id
              roast_level
              roaster
              image_url
            }
          }
        }
      }
    `,
    { variables: { tinId } }
  );

  const tin = data?.tin;
  const coffeeBag = tin?.coffee_depletion?.coffee_bag;

  const roaster = coffeeBag?.roaster;
  const name = coffeeBag?.name;
  const roastLevel = coffeeBag?.roast_level;
  const imageUrl: string | null = coffeeBag?.image_url;

  // Claim Shot Logic
  const [isClaimed, setIsClaimed] = React.useState(false);
  const [claimShotMutation, claimShotProperties] = useMutation(
    gql`
      mutation ClaimShot($tinId: Int!, $depletionId: Int!) {
        update_tin_by_pk(
          pk_columns: { id: $tinId }
          _set: { coffee_depletion_id: null }
        ) {
          id
          coffee_depletion_id
        }
        update_coffee_depletion_by_pk(
          pk_columns: { id: $depletionId }
          _set: { isUsed: true }
        ) {
          id
          isUsed
        }
      }
    `,
    {
      variables: {
        tinId,
        depletionId: tin?.coffee_depletion?.id,
      },
    }
  );
  const onClaimShot = async () => {
    await claimShotMutation();
    setIsClaimed(true);
  };

  React.useEffect(() => {
    if (!loading && !error) {
      setIsClaimed(
        tin?.coffee_depletion?.id == undefined || tin?.coffee_depletion.isUsed
      );
    }
  }, [loading]);

  // Rendering
  if (loading || claimShotProperties.loading) {
    return <p>loading...</p>;
  }
  if (error) {
    return <p>Sorry something went wrong :(</p>;
  }
  if (isClaimed) {
    return <p>This Tin is Claimed</p>;
  }
  return (
    <div>
      <p>{"today you're drinking:"}</p>
      <div>
        <div>
          <img
            src={imageUrl ?? ""}
            alt='bag image'
            style={{ height: "300px", width: "300px" }}
          />
        </div>
        <div>
          <p>{roaster}</p>
          <p>{name}</p>
          <p>Roast Level: {roastLevel}</p>
        </div>
      </div>
      <button onClick={onClaimShot}>Claim Shot</button>
    </div>
  );
};

export default ClaimPage;
