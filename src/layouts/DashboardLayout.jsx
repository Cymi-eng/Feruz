import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>

    </div>
  )
}

export default DashboardLayout