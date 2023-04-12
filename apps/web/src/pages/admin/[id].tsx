import { SelfUser, permer } from "@imperial/commons";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { Check, X } from "react-feather";
import { ConnectedProps, connect } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { addNotification } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { styled } from "../../stitches.config";
import { makeRequest } from "../../utils/Rest";
import FourOFour from "../404";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 500,
  minHeight: "100vh",
  margin: "0 auto",

  "> svg": {
    position: "absolute",
    top: 20,
    left: 20,
  },
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "$primary",
  border: "1px solid $contrast",
  borderRadius: "$large",
  gap: 25,
  overflow: "auto",
  height: "100%",
  padding: "$large",

  "> h1": {
    fontSize: "2rem",
    color: "$text-primary",
  },

  "> code": {
    color: "$text-secondary",
  },
});

const ButtonList = styled("div", {
  display: "flex",
  gap: 10,
});

export const getServerSideProps: GetServerSideProps<{
  user: SelfUser;
}> = async (context) => {
  if (!context.req.cookies["imperial-auth"]) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const response = await makeRequest<SelfUser>(
    "GET",
    `/admin/${context?.params?.id}`,
    undefined,
    {
      headers: {
        Authorization: context.req.cookies["imperial-auth"],
      },
    },
  );

  if (!response.success || !response.data) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: response.data,
    },
  };
};

type InferProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function User({ selfUser, user: fetchedUser, dispatch }: ReduxProps & InferProps) {
  const [user, setUser] = useState(fetchedUser);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const isAdmin = permer.test(selfUser?.flags ?? 0, "admin");

  const patchUser = async (
    body: Partial<{
      username: string;
      email: string;
      member_plus: boolean;
      confirmed: boolean;
      banned: boolean;
    }>,
  ) => {
    const { success, data, error } = await makeRequest<SelfUser>(
      "PATCH",
      `/admin/${user.id}`,
      body,
    );

    if (!success || !data) {
      dispatch(
        addNotification({
          type: "error",
          message: error?.message ?? "Failed to update user",
          icon: <X />,
        }),
      );
      return;
    }

    dispatch(
      addNotification({
        type: "success",
        message: "Successfully updated user",
        icon: <Check />,
      }),
    );

    setUser(data);
  };

  return (
    <Wrapper>
      <Container>
        {!selfUser || !isAdmin ? (
          <FourOFour />
        ) : (
          <>
            <h1>Info For {user.username}</h1>
            <ButtonList>
              <Button
                onClick={() => {
                  patchUser({ member_plus: !permer.test(user.flags, "member-plus") });
                }}
              >
                {permer.test(user.flags, "member-plus")
                  ? "Revoke Member+"
                  : "Grant Member+"}
              </Button>

              <Button
                onClick={() => {
                  patchUser({ confirmed: !user.confirmed });
                }}
              >
                {user.confirmed ? "Unconfirm Email" : "Confirm Email"}
              </Button>
              <Button
                onClick={() => {
                  patchUser({ banned: !user.banned });
                }}
              >
                {user.banned ? "Unban User" : "Ban User"}
              </Button>
            </ButtonList>
            <Input
              hideIconUntilDifferent
              label="Update Username"
              icon={<Check />}
              placeholder="Update Username"
              value={username}
              iconPosition="right"
              iconClick={() => {
                patchUser({ username });
              }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              hideIconUntilDifferent
              label="Update Email"
              icon={<Check />}
              placeholder="Update Email"
              value={email}
              iconPosition="right"
              iconClick={() => {
                patchUser({ email });
              }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </>
        )}
      </Container>
    </Wrapper>
  );
}

const mapStateToProps = ({ user }: ImperialState) => ({
  selfUser: user,
});
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(User);
