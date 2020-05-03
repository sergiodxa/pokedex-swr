import { createResource, Resource } from "./create-resource";

const cache = new Map<string, any>();

export function readImage(source: string): Resource<string> {
  if (cache.has(source)) return cache.get(source);
  const resource = createResource<string>(
    () =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = source;
        img.addEventListener("load", () => resolve(source));
        img.addEventListener("error", () =>
          reject(new Error(`Failed to load image ${source}`))
        );
      })
  );
  cache.set(source, resource);
  return resource;
}
