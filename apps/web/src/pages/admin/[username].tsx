import { permer } from "@imperial/commons";
import Button from "@web/components/Button";
import { Check, X } from "react-feather";
import { connect, ConnectedProps } from "react-redux";
import { SearchIcon } from "../../components/Icons";
import Input from "../../components/Input";
import { addNotification } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { styled } from "../../stitches.config";
import FourOFour from "../404";
import { useEffect, useState } from "react";
import { makeRequest } from "../../utils/Rest";
import { useRouter } from "next/router";
import { Document } from "../../types";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 500,
  height: "100vh",
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
  padding: "$large",

  "> h1": {
    fontSize: "2rem",
    color: "$text-primary",
  },
});

const Options = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 10,
});

const Documents = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  width: "100%",

  "> div": {
    width: "100%",
    display: "flex",
    cursor: "pointer",
    flexDirection: "column",
    alignItems: "flex-start",
    background: "$secondary",
    padding: "$medium",
    border: "1px solid $contrast",
    borderRadius: "$small",
    gap: 5,
  },
});

function Admin({ user, dispatch }: ReduxProps) {
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const router = useRouter();

  const isAdmin = permer.test(user?.flags ?? 0, "admin");
  const createMemberPlusInvite = async () => {
    const { success, data, error } = await makeRequest<{ token: string }>(
      "POST",
      "/admin/member_plus",
    );

    if (!success || !data) {
      return dispatch(
        addNotification({
          message: error?.message ?? "an error occurred creating member+ invite",
          type: "error",
          icon: <X />,
        }),
      );
    }

    dispatch(
      addNotification({
        message: "Created Member+ Invite (click to copy)",
        type: "warning",
        icon: <Check />,
        onClick() {
          navigator.clipboard.writeText(data.token);
        },
      }),
    );
  };

  const fetchRecentDocuments = async () => {
    const { success, data, error } = await makeRequest<Document[]>(
      "GET",
      "/admin/recent",
    );

    if (!success) {
      dispatch(
        addNotification({
          message: error?.message ?? "an error occurred fetching recent documents",
          type: "error",
          icon: <X />,
        }),
      );
    }

    setRecentDocuments(data ?? []);
  };

  useEffect(() => {
    fetchRecentDocuments();
  }, []);

  return (
    <Wrapper>
      <Container>
        {!user || !isAdmin ? (
          <FourOFour />
        ) : (
          <>
            <h1>Admin Panel</h1>

            <Options>
              <Button onClick={createMemberPlusInvite}>Create Member+ Invite</Button>
              <Input
                icon={<SearchIcon />}
                label="Search Users"
                placeholder="Search Users"
              />
              <label>
                <span>Recent Documents</span>
                <Documents>
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} onClick={() => router.push(`/${doc.id}`)}>
                      <span>{doc.id}</span>
                    </div>
                  ))}
                </Documents>
              </label>
            </Options>
          </>
        )}
      </Container>
    </Wrapper>
  );
}

const mapStateToProps = ({ user }: ImperialState) => ({
  user,
});
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Admin);