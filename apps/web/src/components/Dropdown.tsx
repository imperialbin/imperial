import { Placement } from "@floating-ui/react-dom-interactions";
import { CSSProperties } from "@stitches/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { styled } from "@web/stitches.config";
import Popover from "./popover/Popover";

const Wrapper = styled("ul", {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  margin: 0,
  padding: 0,
  maxHeight: 300,
  overflow: "auto",

  "> img": {
    width: 30,
    borderRadius: "50%",
  },

  "> button": {
    display: "flex",
    alignItems: "center",
    color: "var(--text-secondary)",
    cursor: "pointer",
    textAlign: "unset",
    background: "unset",
    outline: "none",
    border: "none",
    fontWeight: 500,
    fontSize: "0.9em",
    borderRadius: "$tiny",
    gap: 10,
    transition: "all 0.15s ease-in-out",
    padding: "10px 40px 10px 15px",

    "&:hover": {
      color: "hsl(var(--text-secondary))",
      backgroundColor: "$primary-700",
    },

    "&:focus-visible": {
      boxShadow: "0 0 0 4px rgba(var(--brand-rgb), 0.5)",
    },
  },
});

const DropdownButton = styled("button", {
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  padding: "5px 10px",
  fontWeight: 500,
  background: "transparent",
  gap: 10,
  outline: "none",
  cursor: "pointer",
  color: "$text-secondary",
  border: "1px solid $primary500",
  borderRadius: "$tiny",
  opacity: 1,
  overflow: "hidden",
  transition: "all 0.15s ease-in-out",

  "&:hover": {
    opacity: 1,
  },

  "&:focus-visible": {
    boxShadow: "0 0 0 4px rgba(var(--brand-rgb), 0.5)",
  },

  "> span": {
    textAlign: "left",
    width: "fit-content",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexGrow: 1,
  },

  "> svg": {
    transition: "transform 0.15s ease-in-out",
  },

  "> img": {
    width: 30,
    borderRadius: "50%",
  },
});

export type DropdownItem<T> = {
  selected?: boolean;
  value: T;
  title: string;
  icon?: JSX.Element | string;
};

export interface IDropdownProps<T> {
  placement?: Placement;
  items: DropdownItem<T>[];

  // eslint-disable-next-line no-unused-vars
  onSelect: (item: DropdownItem<T>) => unknown;
  notSelectedOverride?: string;

  /* Optional parameter to automatically set width to targets width */
  widthAtTarget?: boolean;

  /* Children is the element we're targeting */
  children?: JSX.Element;

  /* This is so then you can style it with styled components via styled(Dropdown) */
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

function Dropdown<T>({
  placement = "bottom-start",
  items,
  onSelect,
  notSelectedOverride,
  widthAtTarget,
  children,
  className,
  style,
  disabled = false,
}: IDropdownProps<T>) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<DropdownItem<T> | null>(
    items.find((item) => item.selected) ?? null,
  );

  const stableSetSelected = useCallback((item: DropdownItem<T>) => setSelected(item), []);

  // Update the selected item if items changes through props
  useEffect(() => {
    setSelected(items.find((item) => item.selected) ?? null);
  }, [items]);

  return (
    <Popover
      render={({ close }) => (
        <Wrapper>
          {items.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                onSelect(item);
                stableSetSelected(item);
                close();
              }}
            >
              {typeof item.icon !== "string" ? (
                item.icon
              ) : (
                <img src={item.icon} alt={item.title} />
              )}
              {item.title}
            </button>
          ))}
        </Wrapper>
      )}
      active={active}
      setPopover={setActive}
      toggleOnTargetClick={!disabled}
      widthAtTarget={widthAtTarget}
      placement={placement}
      positionStrategy="fixed"
    >
      {/* This allows developers ot make their own component if they really want. */}
      {children ? (
        children
      ) : (
        <DropdownButton disabled={disabled} className={className} style={style}>
          {typeof selected?.icon !== "string" ? (
            selected?.icon
          ) : (
            <img src={selected.icon} alt={selected.title} />
          )}
          <span>{selected?.title ?? notSelectedOverride ?? "Not selected"}</span>

          <ChevronDown width={14} />
        </DropdownButton>
      )}
    </Popover>
  );
}

export default Dropdown;
