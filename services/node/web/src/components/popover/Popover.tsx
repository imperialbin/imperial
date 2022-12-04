import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  Strategy,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useId,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, useCallback, useEffect, useMemo } from "react";
import { styled } from "../../stitches";
import { PopoverBase } from "./base/popover";

const Wrapper = styled(motion.div, {
  position: "absolute",
  overflow: "hidden",
  color: "$text-primary",
  borderRadius: "$tiny",
  border: "2px solid var(--bg-contrast)",
  background: "transparent",
  boxShadow: "$dialogs",
  backdropFilter: "blur(10px) saturate(190%) contrast(70%) brightness(50%)",
});

interface IPopover {
  active: boolean;

  /* Children is the element we're targeting */
  children: JSX.Element;

  /* render is the actual popover content */
  render: (defaults: PopoverBase) => React.ReactNode;

  setPopover: (open: boolean) => void;

  placement?: Placement;
  clickToClose?: boolean;

  /* Optional parameter to automatically set width to targets width */
  widthAtTarget?: boolean;

  /* Enable popover on target click */
  toggleOnTargetClick?: boolean;

  /* Enable popover on hover */
  toggleOnHover?: boolean;

  /* Allow focusing in popover */
  toggleFocus?: boolean;

  /* Allows you to specify if you want absolute positioning or fixed positioning */
  positionStrategy?: Strategy;
}

const Popover = ({
  children,
  active,
  setPopover,
  render,

  /* options */
  clickToClose = true,
  placement = "bottom",
  toggleFocus = false,
  toggleOnHover = false,
  toggleOnTargetClick = true,
  widthAtTarget = false,
  positionStrategy = "absolute",
}: IPopover) => {
  const { x, y, reference, floating, strategy, refs, update, context } =
    useFloating({
      open: active,
      onOpenChange: setPopover,
      middleware: [offset(10), flip(), shift()],
      /* Always have tooltips on the bottom for mobiles unless if the dev wants it on the top */
      placement: placement ?? "bottom",
      strategy: positionStrategy,
    });

  const closePopover = useCallback(() => setPopover(false), [setPopover]);

  const getPlacementPosition = () => {
    if (placement.includes("top")) return "top";
    if (placement.includes("bottom")) return "bottom";
    if (placement.includes("left")) return "left";
    if (placement.includes("right")) return "right";
  };

  const WRAPPER_ANIMATION = useMemo(
    () => ({
      initial: {
        opacity: 0.5,
        scale: 0.95,
        y:
          getPlacementPosition() === "top"
            ? 10
            : getPlacementPosition() === "bottom"
            ? -10
            : 0,
        x:
          getPlacementPosition() === "left"
            ? 10
            : getPlacementPosition() === "right"
            ? -10
            : 0,
      },
      animate: { opacity: 1, scale: 1, y: 0, x: 0 },
      exit: {
        opacity: 0,
        scale: 0.95,
        y:
          getPlacementPosition() === "top"
            ? 10
            : getPlacementPosition() === "bottom"
            ? -10
            : 0,
        x:
          getPlacementPosition() === "left"
            ? 10
            : getPlacementPosition() === "right"
            ? -10
            : 0,
      },
      transition: {
        duration: 0.15,
      },
    }),
    [placement]
  );

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && active) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [active, update, refs.reference, refs.floating]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, {
      enabled: toggleOnTargetClick,
    }),
    useDismiss(context, {
      outsidePointerDown: clickToClose,
    }),
    useFocus(context, {
      enabled: toggleFocus,
      keyboardOnly: true,
    }),
    useHover(context, {
      enabled: toggleOnHover,
    }),
  ]);

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const PopoverElement = (
    <AnimatePresence>
      {active ? (
        <FloatingFocusManager
          context={context}
          order={["reference", "content"]}
          returnFocus={false}
          initialFocus={false}
        >
          <Wrapper
            {...getFloatingProps({
              "aria-labelledby": labelId,
              "aria-describedby": descriptionId,
            })}
            ref={floating}
            className="Popover"
            transition={WRAPPER_ANIMATION.transition}
            initial={WRAPPER_ANIMATION.initial}
            exit={WRAPPER_ANIMATION.exit}
            animate={WRAPPER_ANIMATION.animate}
            style={{
              position: strategy,
              top: y ?? "",
              left: x ?? "",
              width: widthAtTarget
                ? refs.reference.current?.getBoundingClientRect().width
                : "auto",
              zIndex: 999,
            }}
          >
            {render({
              close: closePopover,
            })}
          </Wrapper>
        </FloatingFocusManager>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props })
      )}

      <FloatingPortal id="popovers">{PopoverElement}</FloatingPortal>
    </>
  );
};

export default Popover;
