import React from 'react'

// Dummy data (replace with backend API later)
const dummyUsers = [
  { id: 'U-001', name: 'John Doe', email: 'john@email.com', joined: '2025-01-15', orders: 8, status: 'Active' },
  { id: 'U-002', name: 'Jane Smith', email: 'jane@email.com', joined: '2025-02-20', orders: 3, status: 'Active' },
  { id: 'U-003', name: 'Mike Lee', email: 'mike@email.com', joined: '2025-03-10', orders: 12, status: 'Active' },
  { id: 'U-004', name: 'Sara Wilson', email: 'sara@email.com', joined: '2025-03-22', orders: 1, status: 'Active' },
  { id: 'U-005', name: 'Tom Brown', email: 'tom@email.com', joined: '2025-04-01', orders: 5, status: 'Active' },
  { id: 'U-006', name: 'Amy Roberts', email: 'amy@email.com', joined: '2025-04-05', orders: 0, status: 'Banned' },
  { id: 'U-007', name: 'Dan White', email: 'dan@email.com', joined: '2025-04-08', orders: 2, status: 'Active' },
  { id: 'U-008', name: 'Lisa Chen', email: 'lisa@email.com', joined: '2025-04-10', orders: 6, status: 'Active' },
]

const AdminUsers = () => {
  return (
    <div>
      <h1 className='text-2xl font-medium text-gray-800 mb-6'>Users</h1>

      <div className='bg-white border border-gray-200 rounded overflow-hidden'>
        {/* Desktop Table */}
        <div className='hidden md:block'>
          <table className='w-full text-base'>
            <thead>
              <tr className='border-b border-gray-100 text-gray-500 text-left'>
                <th className='py-3 px-5 font-medium'>Name</th>
                <th className='py-3 px-5 font-medium'>Email</th>
                <th className='py-3 px-5 font-medium'>Joined</th>
                <th className='py-3 px-5 font-medium'>Orders</th>
                <th className='py-3 px-5 font-medium'>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyUsers.map(user => (
                <tr key={user.id} className='border-b border-gray-50 hover:bg-gray-50'>
                  <td className='py-3 px-5'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 font-medium'>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className='text-gray-800 font-medium'>{user.name}</span>
                    </div>
                  </td>
                  <td className='py-3 px-5 text-gray-600'>{user.email}</td>
                  <td className='py-3 px-5 text-gray-500'>{user.joined}</td>
                  <td className='py-3 px-5 text-gray-600'>{user.orders}</td>
                  <td className='py-3 px-5'>
                    <span className={`text-sm px-2.5 py-1 rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className='md:hidden space-y-3 p-4'>
          {dummyUsers.map(user => (
            <div key={user.id} className='border border-gray-100 rounded p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 font-medium'>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className='text-base font-medium text-gray-800'>{user.name}</p>
                  <p className='text-sm text-gray-400'>{user.email}</p>
                </div>
              </div>
              <div className='flex justify-between text-sm text-gray-400 mt-2'>
                <span>Joined: {user.joined}</span>
                <span>{user.orders} orders</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
