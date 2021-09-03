import type { NextPage } from "next";
import { Editor, Modal } from "../components";
import { useUser } from "../hooks/useUser";
import { Nav } from "../layout/nav";

const Home: NextPage = () => {
  const { user, isError, isLoading } = useUser();

  return (
    <div>
      <Modal title="hey" />
      <Nav user={user} creatingDocument />
      <Editor user={user} />
    </div>
  );
};

export default Home;
