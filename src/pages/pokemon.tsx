import Link from "next/link";
import { fetcher } from "../utils/fetcher";
import useSWR, { useSWRPages } from "swr";
import clsx from "clsx";
import useOnScreen from "../hooks/use-on-screen";
import { useRef, useEffect, Suspense } from "react";
import { readImage } from "../utils/read-image";

function getColorByType(type = "") {
  switch (type) {
    case "bug":
    case "grass": {
      return "bg-green-100 text-green-900";
    }
    case "fire": {
      return "bg-red-100 text-red-900";
    }
    case "water": {
      return "bg-blue-100 text-blue-900";
    }
    case "electric": {
      return "bg-yellow-100 text-yellow-900";
    }
    case "fairy":
    case "psychic": {
      return "bg-pink-100 text-pink-900";
    }
    case "ice": {
      return "bg-teal-100 text-teal-900";
    }
    case "dragon": {
      return "bg-indigo-100 text-indigo-900";
    }
    case "ground":
    case "rock":
    case "fighting": {
      return "bg-orange-100 text-orange-900";
    }
    case "ghost":
    case "poison": {
      return "bg-purple-100 text-purple-900";
    }
    case "dark": {
      return "bg-gray-700 text-gray-100";
    }
    case "steel":
    case "flying":
    case "normal":
    default: {
      return "bg-gray-100 text-gray-900";
    }
  }
}

function getAccentColorByType(type = "") {
  switch (type) {
    case "bug":
    case "grass": {
      return "bg-green-200";
    }
    case "fire": {
      return "bg-red-200";
    }
    case "water": {
      return "bg-blue-200";
    }
    case "electric": {
      return "bg-yellow-200";
    }
    case "fairy":
    case "psychic": {
      return "bg-pink-200";
    }
    case "ice": {
      return "bg-teal-200";
    }
    case "dragon": {
      return "bg-indigo-200";
    }
    case "ground":
    case "rock":
    case "fighting": {
      return "bg-orange-200";
    }
    case "ghost":
    case "poison": {
      return "bg-purple-200";
    }
    case "dark": {
      return "bg-gray-600";
    }
    case "steel":
    case "flying":
    case "normal":
    default: {
      return "bg-gray-200";
    }
  }
}

function getFirstType(types) {
  return types.slice().sort()[0];
}

function Card({ children, className = "" }) {
  const cn = clsx("rounded-lg px-6 py-2 flex items-center", className);
  return (
    <article className={cn} style={{ minHeight: "112px" }}>
      {children}
    </article>
  );
}

function PokémonCard({ name }: { name: string }) {
  const { data: pokemon } = useSWR(`pokemon/${name}`, fetcher, {
    suspense: true,
  });

  if (!pokemon) {
    return (
      <Card className={getColorByType()}>
        <h2 className="text-2xl capitalize leading-none">{name}</h2>
      </Card>
    );
  }

  readImage(pokemon.sprites.front_default).read();

  const firstType = getFirstType(pokemon.types.map(({ type }) => type.name));

  return (
    <Card className={getColorByType(firstType)}>
      <div className="space-y-3">
        <h2 className="text-2xl capitalize leading-none">{name}</h2>
        <div className="space-x-2 flex flex-row items-center justify-start">
          {pokemon.types.map(({ type }) => (
            <div
              key={type.name}
              className={clsx(
                "py-2 px-4 rounded-full inline-block capitalize leading-none",
                getAccentColorByType(firstType)
              )}
            >
              {type.name}
            </div>
          ))}
        </div>
      </div>
      <img className="ml-auto" src={pokemon.sprites.front_default} alt={name} />
    </Card>
  );
}

interface BasicPokemon {
  name: string;
  url: string;
}

interface Response {
  results: BasicPokemon[];
}

export default function Pokemon() {
  const { pages, loadMore, isLoadingMore, isReachingEnd } = useSWRPages(
    "pokemon",
    ({ offset, withSWR }) => {
      const url = offset || "https://pokeapi.co/api/v2/pokemon";
      const { data } = withSWR(useSWR<Response>(url, fetcher));

      if (!data) return null;

      const { results } = data;
      return results.map((result) => (
        <Suspense
          fallback={
            <Card className={getColorByType()}>
              <h2 className="text-2xl capitalize leading-none">
                {result.name}
              </h2>
            </Card>
          }
        >
          <PokémonCard key={result.name} name={result.name} />
        </Suspense>
      ));
    },
    (swr) => swr.data.next,
    []
  );

  const $loadMore = useRef();

  const isOnScreen = useOnScreen($loadMore, "115px");

  useEffect(() => {
    if (isOnScreen) loadMore();
  }, [isOnScreen]);

  return (
    <main className="p-6 space-y-4">
      <Link href="/">
        <a>
          <h1 className="text-3xl font-semibold leading-tight">Pokémon</h1>
        </a>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages}
      </div>
      {!isReachingEnd && (
        <button
          ref={$loadMore}
          className="bg-red-600 border-solid border-2 hover:bg-white border-red-600 text-white hover:text-red-600 font-bold py-2 px-4 rounded-full mx-auto block"
          disabled={isLoadingMore}
          onClick={loadMore}
        >
          {isLoadingMore ? <>Loading...</> : <>Load More Pokémon</>}
        </button>
      )}
    </main>
  );
}
