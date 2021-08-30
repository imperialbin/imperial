import Skeleton, { SkeletonProps } from "react-loading-skeleton";

export const UserIconSkeleton = (
  props: SkeletonProps,
  { width = 45, height = 45 }: { width: number; height: number }
): JSX.Element => (
  <Skeleton
    {...props}
    style={{ ...props.style, borderRadius: "50%" }}
    width={width}
    height={height}
  />
);
