export default function UsersLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-24 h-8 bg-white/10 rounded"></div>
      </div>
      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4"><div className="w-16 h-4 bg-white/10 rounded"></div></th>
              <th className="px-6 py-4"><div className="w-16 h-4 bg-white/10 rounded"></div></th>
              <th className="px-6 py-4"><div className="w-16 h-4 bg-white/10 rounded"></div></th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/5"></div>
                    <div className="w-24 h-4 bg-white/10 rounded"></div>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="w-20 h-4 bg-white/5 rounded"></div></td>
                <td className="px-6 py-4"><div className="w-16 h-6 bg-white/10 rounded-full"></div></td>
                <td className="px-6 py-4"><div className="w-6 h-6 bg-white/5 rounded ml-auto"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}