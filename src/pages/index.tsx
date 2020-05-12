import { useState, FormEvent } from "react";
import clsx from "clsx";
import Link from "next/link";
import Router from "next/router";
import { mutate } from "swr";
import { fetcher } from "../utils/fetcher";
import { noop } from "../utils/noop";

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="bg-gray-200 py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full text-base"
        type="search"
        name="pokemon"
        placeholder="Ditto"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}

interface CardProps {
  label: React.ReactNode;
  color: "red" | "teal" | "blue" | "yellow" | "pink" | "orange";
  href: string;
  as?: string;
  prepare?: () => void;
}

function Card({ label, href, as = href, color, prepare = noop }: CardProps) {
  const bgs = {
    teal: "bg-teal-300 text-teal-900 hover:bg-teal-600 hover:text-teal-100",
    red: "bg-red-300 text-red-900 hover:bg-red-600 hover:text-red-100",
    blue: "bg-blue-300 text-blue-900 hover:bg-blue-600 hover:text-blue-100",
    yellow:
      "bg-yellow-300 text-yellow-900 hover:bg-yellow-600 hover:text-yellow-100",
    pink: "bg-pink-300 text-pink-900 hover:bg-pink-600 hover:text-pink-100",
    orange:
      "bg-orange-300 text-orange-900 hover:bg-orange-600 hover:text-orange-100",
  };

  const className = clsx(
    "rounded-lg py-3 px-4 text-white shadow-md transition duration-75",
    bgs[color]
  );

  return (
    <Link href={href} as={as}>
      <a className={className} onMouseEnter={prepare}>
        {label}
      </a>
    </Link>
  );
}

function handleSearch(query) {
  Router.push(`/pokemon?search=${query.toLowerCase()}`);
}

function prefetchPokemon() {
  const url = "https://pokeapi.co/api/v2/pokemon";
  return mutate(url, fetcher(url));
}

export default function Pokedex() {
  return (
    <section className="space-y-8 md:space-y-12 mb-4">
      <header className="px-8 pt-16 pb-8 space-y-8 bg-white rounded-b-xl md:rounded-none shadow-xl">
        <h1 className="text-3xl font-semibold leading-tight">
          What Pokémon
          <br /> are you looking for?
        </h1>

        <SearchBox onSearch={handleSearch} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card
            label="Pokémon"
            href="/pokemon"
            color="teal"
            prepare={prefetchPokemon}
          />
          <Card label="Moves" href="/moves" color="red" />
          <Card label="Abilities" href="/abilities" color="yellow" />
          <Card label="Items" href="/items" color="blue" />
          <Card label="Locations" href="/locations" color="pink" />
          <Card label="Types" href="/types" color="orange" />
        </div>
      </header>

      <main className="mx-4 p-4 md:p-8 bg-white shadow-md rounded-md space-y-3 max-w-screen-sm sm:mx-auto">
        <h2 className="text-lg">Pokédex SWR</h2>
        <p>
          This project is an example Frontend application using showcasing how
          to use SWR for data fetching.
        </p>
        <p>
          The application is using Next.js as framework and TailwindCSS to build
          the styles. And is consuming data from{" "}
          <a href="https://pokeapi.co">PokéAPI</a>
        </p>
      </main>
    </section>
  );
}
