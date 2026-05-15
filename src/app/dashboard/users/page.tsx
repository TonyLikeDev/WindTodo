import { getAllUsers } from '@/app/actions/userActions';
import AddUserForm from '@/components/AddUserForm';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
        <AddUserForm />
      </div>
      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                  No users yet. Add one by email above.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isPending = user.id.startsWith('pending:');
                const displayName = user.name || user.email.split('@')[0];
                const initials = displayName.slice(0, 2).toUpperCase();
                return (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/10 overflow-hidden">
                          {user.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">{displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                        isPending ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        {isPending ? 'Pending sign-in' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
