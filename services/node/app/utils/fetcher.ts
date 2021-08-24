export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    mode: "cors",
    credentials: "include",
  });

  if (!res.ok) {
    const error: any = new Error("An error occurred whilst fetching data!");

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
