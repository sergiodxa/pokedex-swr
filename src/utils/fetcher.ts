import { resolve } from "url"

const BASE_PATH = "https://pokeapi.co/api/v2/"

export function fetcher(path: string) {
  return fetch(resolve(BASE_PATH, path)).then(res => res.json())
}
