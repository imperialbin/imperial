import { User, permer } from "@imperial/commons";
import Button from "@web/components/Button";
import debounce from "lodash/debounce";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Check, X } from "react-feather";
import { ConnectedProps, connect } from "react-redux";
import { SearchIcon } from "../../components/Icons";
import Input from "../../components/Input";
import Popover from "../../components/popover/Popover";
import SelectUsersPopover from "../../components/popover/SelectUsersPopover";
import { addNotification } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { styled } from "../../stitches.config";
import { Document } from "../../types";
import { makeRequest } from "../../utils/rest";
import FourOFour from "../404";

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

export const getServerSideProps: GetServerSideProps<{
  recentDocuments: Document[] | null;
}> = async (context) => {
  if (!context.req.cookies["imperial-auth"]) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const response = await makeRequest<Document[]>("GET", "/admin/recent", undefined, {
    headers: {
      Authorization: context.req.cookies["imperial-auth"],
    },
  });

  return {
    props: {
      recentDocuments: response.data ?? null,
    },
  };
};

type InferProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function Admin({ user, dispatch, recentDocuments }: ReduxProps & InferProps) {
  const [usersQuery, setUsersQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const router = useRouter();
  const isAdmin = permer.test(user?.flags ?? 0, "admin");

  const createMemberPlusInvite = async () => {
    const { success, data, error } = await makeRequest<{ token: string }>(
      "POST",
      "/admin/member_plus",
      {},
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
        type: "success",
        icon: <Check />,
        onClick() {
          navigator.clipboard.writeText(data.token);
        },
      }),
    );
  };

  const searchUsers = useCallback(
    debounce(async (query: string) => {
      const { success, data, error } = await makeRequest<User[]>(
        "GET",
        `/users/search/${query}`,
      );

      if (!success || !data) {
        return dispatch(
          addNotification({
            message: error?.message ?? "an error occurred searching users",
            type: "error",
            icon: <X />,
          }),
        );
      }

      setSearchedUsers(data);
    }, 500),
    [],
  );

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
              <Popover
                active={searchedUsers.length > 0 && popoverOpen}
                setPopover={() => setPopoverOpen(!popoverOpen)}
                render={(defaultProps) => (
                  <SelectUsersPopover
                    users={searchedUsers}
                    onClick={(user) => {
                      router.push(`/admin/${user.id}`);
                    }}
                    {...defaultProps}
                  />
                )}
                clickToClose={false}
              >
                <Input
                  icon={{ svg: <SearchIcon /> }}
                  label="Search Users"
                  placeholder="Search Users"
                  value={usersQuery}
                  onBlur={() => setPopoverOpen(false)}
                  onChange={(e) => {
                    setUsersQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                />
              </Popover>
              <label>
                <span>Recent Documents</span>
                <Documents>
                  {recentDocuments?.map((doc) => (
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
