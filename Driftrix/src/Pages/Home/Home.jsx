import { Helmet } from "react-helmet-async";
import WhiteBoardComponent from "../../Components/WhiteBoardComponent";

const Home = () => {
  return (
    <div className="">
      <Helmet>
        <title>Draftrix - Draw Here!</title>
      </Helmet>
      <WhiteBoardComponent></WhiteBoardComponent>
    </div>
  );
};

export default Home;
