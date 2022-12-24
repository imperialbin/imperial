import { store } from "../../state";
import { addEditor } from "../../state/actions";
import { styled } from "../../stitches";
import { User } from "../../types";
import { PopoverBase } from "./base/popover";

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  margin: 5,
});

const Item = styled("button", {
  display: "flex",
  gap: 5,
  alignItems: "center",
  padding: 10,
  borderRadius: "$medium",
  background: "unset",
  textAlign: "unset",
  fontSize: "1.05em",
  cursor: "pointer",
  color: "$text-secondary",
  border: "1.5px solid transparent",

  transition: "background 0.15s ease-in-out, border 0.15s ease-in-out",

  "&:hover": {
    background: "$primary",
    border: "1.5px solid $contrast",
  },

  "> img": {
    width: 30,
    height: 30,
    borderRadius: "50%",
  },

  "> div": {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,

    "> h1": {
      fontSize: "0.85em",
      color: "$text-primary",
    },

    "> span": {
      fontSize: "0.7em",
      color: "$text-secondary",
    },
  },

  "> svg": {
    cursor: "pointer",
    transition: "color 0.15s ease-in-out",

    "&:hover": {
      color: "$error",
    },
  },
});

interface IEditorsPopoverProps extends PopoverBase {
  users: User[];
}

const EditorsPopover = ({ close, users }: IEditorsPopoverProps) => {
  return (
    <div>
      <List>
        {users.map((user) => (
          <Item
            onClick={() => {
              close();
              store.dispatch(addEditor(user));
            }}
          >
            <img src={user.icon ?? "/img/pfp.png"} alt={user.username} />
            <div>
              <h1>{user.username}</h1>
              <span>{user.documents_made} documents made</span>
            </div>
          </Item>
        ))}
      </List>
    </div>
  );
};

export default EditorsPopover;
