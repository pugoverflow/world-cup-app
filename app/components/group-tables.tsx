import { useAppSelector } from "../store";

export function GroupTables() {
  const groups = useAppSelector((state) => state.groups);

  if (groups.length === 0) {
    return (
      <p className="text-sm text-neutral-600">
        No group standings available yet.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Group Tables</h2>
      {groups.map((group) => (
        <section key={group.name}>
          <h3 className="mb-3 text-lg font-medium">{group.name}</h3>
          <ul className="space-y-2 text-sm">
            {group.teams.map((team) => (
              <li key={team.id} className="flex items-center gap-3">
                {team.logo && (
                  <img
                    src={team.logo}
                    alt=""
                    className="size-6 object-contain"
                  />
                )}
                <span>{team.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
