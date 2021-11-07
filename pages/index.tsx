import type { NextPage } from "next";
import Link from "next/link";

const linkStyles = {
  background: "#909CAC",
  margin: "12px 0",
  padding: "12px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "center",
};

const Home: NextPage = () => {
  return (
    <div style={{ width: "calc(100% - 40px)", padding: "0 20px" }}>
      <Link href='/report' passHref>
        <a>
          <div style={linkStyles}>Report</div>
        </a>
      </Link>
      <Link href='/add-bag' passHref>
        <a>
          <div style={linkStyles}>Add Bag</div>
        </a>
      </Link>
      <Link href='/register' passHref>
        <a>
          <div style={linkStyles}>Register</div>
        </a>
      </Link>
    </div>
  );
};

export default Home;
