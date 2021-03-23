if (process.env.APP_MODE === "seed") {
  import("./seed");
} else {
  import("./server");
}
