import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
export default function People() {
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const load = () =>
    api
      .get("/api/users")
      .then((r) => setPeople(r.data.users))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load users"),
      );
  useEffect(() => {
    load();
  }, []);
  const toggle = async (person) => {
    try {
      await api.post(`/api/users/${person.id || person._id}/follow`);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not update follow status");
    }
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-black">Discover people</h1>
      <p className="mb-6 mt-1 text-sm muted">
        Find interesting people and grow your community.
      </p>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {people.map((person) => {
          const following = person.followers?.some(
            (f) => (f._id || f) === user?.id || (f._id || f) === user?._id,
          );
          return (
            <article
              key={person.id || person._id}
              className="card flex items-center gap-3 p-4"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-violet-100 font-bold text-brand">
                {person.profilePicture ? (
                  <img
                    src={person.profilePicture}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  person.name?.[0]
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{person.name}</p>
                <p className="truncate text-xs muted">
                  {person.bio || "No bio yet"}
                </p>
                <p className="mt-1 text-xs muted">
                  {person.followers?.length || 0} followers
                </p>
              </div>
              <button
                onClick={() => toggle(person)}
                className={`btn text-xs ${following ? "btn-muted" : "btn-primary"}`}
              >
                {following ? "Following" : "Follow"}
              </button>
            </article>
          );
        })}
      </div>
      {!people.length && !error && (
        <p className="py-10 text-center muted">
          No other users yet. Invite someone to join!
        </p>
      )}
    </main>
  );
}
