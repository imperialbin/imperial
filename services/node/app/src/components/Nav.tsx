import { connect, ConnectedProps } from "react-redux";
import { ImperialState } from "../../state/reducers";

const Nav = ({ user }: ReduxProps) => {
  return (
    <div>
      <h1>{user ? "welcome" + user.username : "bruh login"}</h1>
    </div>
  );
};

const mapStateToProps = ({ user }: ImperialState) => {
  return { user };
};
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Nav);
