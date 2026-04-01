import type { UserDetail } from "@/lib/queries";

export function UserProfileHeader({ user }: { user: UserDetail }) {
  const initials = user.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="flex items-center gap-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt=""
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-xl font-bold text-gray-400">
          {initials}
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-100">
          {user.full_name || <span className="text-gray-500">No name</span>}
        </h2>
        <p className="text-sm text-gray-400">{user.email}</p>
        {user.username && (
          <p className="text-xs text-gray-500">@{user.username}</p>
        )}
      </div>
      <div className="text-right text-xs text-gray-500">
        <p>Joined {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
      {(user.primary_goals || user.experience_level || user.training_frequency || user.available_equipment) && (
        <div className="ml-4 flex flex-wrap gap-2 border-l border-gray-800 pl-4">
          {user.primary_goals?.[0] && (
            <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
              {user.primary_goals[0].replace(/_/g, " ")}
            </span>
          )}
          {user.experience_level && (
            <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
              {user.experience_level}
            </span>
          )}
          {user.training_frequency && (
            <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
              {user.training_frequency}x/week
            </span>
          )}
          {user.available_equipment && (
            <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
              {user.available_equipment.replace(/_/g, " ")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
