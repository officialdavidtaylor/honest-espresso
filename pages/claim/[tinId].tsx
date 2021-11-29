/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import RequireLogin from "../../components/RequireLogin";
import Loading from "../../components/LoadingAnimation/Loading";

import styles from "./claim.module.css";
import { visit } from "graphql";

interface Props { }

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
              roast_name
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
  const roastName = coffeeBag?.roast_name;

  let buttonText = "Claim Shot";
  let buttonStyle = styles.button;
  let refillButtonLink = "../refill/" + tinId;
  let refillButtonText = undefined;

  let loadingAnimation = false;

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
    loadingAnimation = true;
  }
  if (error) {
    return <p>Sorry something went wrong :(</p>;
  }
  if (isClaimed) {
    buttonText =
      "Claimed by " + (tin?.coffee_depletion?.depletor?.name ?? user?.userName);
    buttonStyle = styles.buttonClicked;

    refillButtonText = "Refill Tin";
  }
  return (
    <RequireLogin>
      <Loading visibility={loadingAnimation} />

      <div className={styles.container}>
        <div className={styles.bagCard}>
          <h6 className={styles.bannerText}>{"today you're drinking:"}</h6>
          <div className={styles.bagInfo}>
            <img
              src={imageUrl ?? ""}
              alt='bag image'
              className={styles.bagImage}
            />
            <div className={styles.bagTextBlock}>
              <h1 className={styles.bagBrand}>{roaster}</h1>
              <h2 className={styles.bagRoastName}>{roastName}</h2>
              <h3 className={styles.bagRoastLevel}>
                Roast Level: {roastLevel}
              </h3>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={buttonStyle}
            disabled={isClaimed}
            onClick={onClaimShot}
          >
            {buttonText}
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <a className={styles.refillButton} href={refillButtonLink}>
            {isClaimed ? refillButtonText : null}
          </a>
        </div>
      </div>

    </RequireLogin>
  );
};

export default ClaimPage;
