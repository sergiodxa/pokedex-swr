export interface Resource<Payload> {
  read: () => Payload;
}

export function createResource<Payload>(
  asyncFn: () => Promise<Payload>
): Resource<Payload> {
  let status = "pending";
  let result: any;
  const promise = asyncFn().then(
    (r: Payload) => {
      status = "success";
      result = r;
    },
    (e: Error) => {
      status = "error";
      result = e;
    }
  );
  return {
    read(): Payload {
      if (status === "pending") throw promise;
      if (status === "error") throw result;
      if (status === "success") return result;
      throw new Error("This should be impossible");
    }
  };
}
