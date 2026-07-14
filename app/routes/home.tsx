import type { Route } from "./+types/home";
import { GroupTables } from "../components/group-tables";
import { getWorldCupGroups } from "../lib/football-api.server";
import { StoreProvider } from "../store";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "World Cup 2026" },
    { name: "description", content: "World Cup 2026 football data" },
  ];
}

export async function loader() {
  return getWorldCupGroups();
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <StoreProvider preloadedState={{ groups: loaderData.groups }}>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-4">
        <h1 className="mb-8 text-3xl font-semibold">World Cup 2026</h1>
        <GroupTables />
      </main>
    </StoreProvider>
  );
}
