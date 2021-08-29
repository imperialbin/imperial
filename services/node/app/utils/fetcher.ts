export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    mode: "cors",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    let error: any = new Error("An error occurred whilst fetching data!");

    switch (res.status) {
      case 404:
        error = new Error("We couldn't find that resource!");
        break;
      case 500:
        error = new Error("An internal server error occurred!");
        break;

      default:
        error = new Error(data.message);
    }

    error.info = data.message;
    error.status = res.status;
    throw error;
  }

  return data;
};
