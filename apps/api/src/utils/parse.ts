const parseDomainFromOrigin = (origin: string) => {
  const url = new URL(origin);
  const domain = url.hostname.split(".").slice(-2).join(".");

  return domain;
};

export { parseDomainFromOrigin };
