import Skeleton, { SkeletonProps } from "react-loading-skeleton";

export const UserIconSkeleton = (
  props: SkeletonProps,
  { width = 52, height = 52 }: { width: number; height: number }
): JSX.Element => (
  <Skeleton
    {...props}
    style={{ ...props.style, borderRadius: "50%" }}
    width={width}
    height={height}
  />
);
