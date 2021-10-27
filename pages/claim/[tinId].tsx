/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import RequireLogin from "../../components/RequireLogin";

interface Props {}

const ClaimPage = (props: Props) => {
  const [user, setUser] = React.useState<null | {
    userId: Number;
    userName: String;
  }>(null);
  React.useEffect(() => {
    const userIdString = localStorage.getItem("userId");
    const userId = userIdString ? parseInt(userIdString) : null;
    const userName = localStorage.getItem("userName") ?? "";
    if (userId) {
      setUser({
        userId,
        userName,
      });
    }
  }, []);

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
            depletor_id
            depletor {
              name
            }
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
        depletionId: tin?.coffee_depletion?.id,
        userId: user?.userId,
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
        tin?.coffee_depletion?.id == undefined ||
          tin?.coffee_depletion.depletor_id
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
    return (
      <p>This Tin was Claimed by: {tin?.coffee_depletion?.depletor?.name ?? user?.userName}</p>
    );
  }
  return (
    <RequireLogin>
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
    </RequireLogin>
  );
};

export default ClaimPage;
