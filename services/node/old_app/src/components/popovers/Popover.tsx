import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import { PopoverBase } from "./popovers";

const Wrapper = styled(motion.div)`
  position: absolute;
  overflow: hidden;
  color: var(--text-primary);
  font-weight: 500;
  background: var(--primary-primary);
  border-radius: var(--card-border-radius);
  border: 1px solid var(--primary-tertiary);
`;

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
}

const Popover = ({
  children,
  active,
  widthAtTarget = false,
  setPopover,
  placement = "bottom",
  clickToClose = true,
  render,
}: IPopover) => {
  const { x, y, reference, floating, strategy, refs, update, context } =
    useFloating({
      open: active,
      onOpenChange: setPopover,
      middleware: [offset(10), flip(), shift()],
      placement,
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
    }),
    [placement],
  );

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && active) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [active, update, refs.reference, refs.floating]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, {
      enabled: true,
    }),
    useRole(context),
    useDismiss(context, {
      outsidePointerDown: clickToClose,
    }),
  ]);

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props }),
      )}

      <AnimatePresence>
        {active ? (
          <FloatingFocusManager
            context={context}
            order={["reference", "content"]}
          >
            <Wrapper
              {...getFloatingProps({
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
              ref={floating}
              className="Popover"
              transition={{ duration: 0.15 }}
              initial={WRAPPER_ANIMATION.initial}
              exit={WRAPPER_ANIMATION.exit}
              animate={WRAPPER_ANIMATION.animate}
              style={{
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                width: widthAtTarget
                  ? refs.reference.current?.getBoundingClientRect().width
                  : "fit-content",
                zIndex: 999,
              }}
            >
              {render({
                close: closePopover,
                descriptionId,
                labelId,
              })}
            </Wrapper>
          </FloatingFocusManager>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Popover;
