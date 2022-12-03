import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Wrapper } from "./base/Styles";

const Signup = ({ dispatch }: ModalProps) => {
  return (
    <Wrapper>
      <Header />
      <h1>signup</h1>
    </Wrapper>
  );
};

export default Signup;
