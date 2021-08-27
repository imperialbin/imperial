export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    mode: "cors",
    credentials: "include",
  });

  if (!res.ok) {
    let error: any = new Error("An error occurred whilst fetching data!");

    if (res.status === 404)
      error = new Error("We couldn't find that resource!");
    if (res.status === 400)
      error = new Error("You did not provide the correct fields!");

    if (res.status >= 500)
      error = new Error("An internal server error occurred!");

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
