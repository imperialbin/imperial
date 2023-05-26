const parseDomainFromOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    const domain = url.hostname.split(".").slice(-2).join(".");

    return domain;
  } catch {
    return "imperialb.in";
  }
};

export { parseDomainFromOrigin };
