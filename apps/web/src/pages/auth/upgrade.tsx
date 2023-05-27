import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowUp, Mail, X } from "react-feather";
import { ConnectedProps, connect } from "react-redux";
import { Container, StyledButton, Wrapper } from "../../components/AuthStyles";
import Input from "../../components/Input";
import { addNotification } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { STRIPE_MEMBER_PLUS_LINK } from "../../utils/constants";
import { makeRequest } from "../../utils/rest";

function Upgrade({ user, dispatch }: ReduxProps) {
  const [token, setToken] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const query = useRouter().query as { token?: string };

  useEffect(() => {
    if (query.token) {
      setToken(query.token);
    }
  }, [query]);

  const upgrade = async () => {
    if (!user) {
      return dispatch(
        addNotification({
          message: "You must be logged in to upgrade your account.",
          type: "error",
          icon: <X />,
        }),
      );
    }

    if (!token) {
      return dispatch(
        addNotification({
          message: "Invalid token.",
          type: "error",
          icon: <X />,
        }),
      );
    }

    setDisableButton(true);
    const { success, error } = await makeRequest("PATCH", "/users/@me/upgrade", {
      token,
    });

    if (!success) {
      setDisableButton(false);

      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst upgrading your account.",
          type: "error",
        }),
      );
    }

    dispatch(
      addNotification({
        icon: <Mail />,
        message: "Sweet! You're now a Member+! Thanks for the support!",
        type: "success",
      }),
    );
  };

  return (
    <Wrapper>
      <Container>
        <div>
          <h1>Upgrade to Member+</h1>
          <p>
            If you haven&apos;t yet purchased a token, you can do so{" "}
            <Link href={STRIPE_MEMBER_PLUS_LINK}>here</Link>. Thanks for your support!{" "}
          </p>
        </div>

        <Input
          value={token}
          placeholder="Member+ Token"
          icon={{ svg: <ArrowUp /> }}
          onChange={({ target: { value } }) => setToken(value)}
        />

        <StyledButton
          clickOnEnter
          disabled={token.length === 0 || disableButton}
          onClick={upgrade}
        >
          Upgrade Account
        </StyledButton>
      </Container>
    </Wrapper>
  );
}

const mapStateToProps = ({ user }: ImperialState) => ({
  user,
});
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Upgrade);
