import type { Group, Team } from "./types";

type Standing = {
  group: string;
  team: Team;
};

const API_BASE = "https://v3.football.api-sports.io";
const TOURNAMENT_ID = "1";
const TOURNAMENT_YEAR = "2026";

async function fetchFootballApi(path: string, params: Record<string, string>) {
  const key = process.env.APISPORTS_KEY;
  if (!key) throw new Error("Missing APISPORTS_KEY environment variable");

  const url = new URL(path, API_BASE);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    headers: { "x-apisports-key": key },
  });

  if (!response.ok) {
    throw new Error(
      `Football API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    errors?: string[] | Record<string, string>;
    response?: unknown;
  };

  const errors = data.errors;
  const messages = Array.isArray(errors)
    ? errors.filter(Boolean)
    : Object.values(errors ?? {}).filter(Boolean);

  if (messages.length > 0) throw new Error(messages.join("; "));

  return data.response;
}

export async function getWorldCupGroups() {
  const response = (await fetchFootballApi("/standings", {
    league: TOURNAMENT_ID,
    season: TOURNAMENT_YEAR,
  })) as Array<{ league?: { standings?: Standing[][] } }> | undefined;

  const standings = response?.[0]?.league?.standings ?? [];

  const groups: Group[] = standings
    .filter((rows) => rows.length > 0 && rows[0].group !== "Group Stage")
    .map((rows) => ({
      name: rows[0].group,
      teams: rows.map((row) => row.team),
    }));

  return { groups };
}
