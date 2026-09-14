import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { MemberProvider } from './context/MemberContext'

import DashboardLayout from './layouts/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import AddMember from './pages/AddMember'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import Community from './pages/Community'
import AddCommunity from './pages/AddCommunity'
import Departments from './pages/Departments'
import AddDepartment from './pages/AddDepartment'
import Groups from './pages/Groups'
import AddGroup from './pages/AddGroup'

function App() {
  return (
    <MemberProvider>

      <BrowserRouter>

        <Routes>

          <Route element={<DashboardLayout />}>

            <Route path="/" element={<Dashboard />} />

            <Route path="/members" element={<Members />} />

            <Route path="/members/add" element={<AddMember />} />

            <Route path="/students" element={<Students />} />

            <Route path="/students/add" element={<AddStudent />} />

            <Route path="/community" element={<Community />} />

            <Route path="/community/add" element={<AddCommunity />} />

            <Route path="/departments" element={<Departments />} />

            <Route path="/departments/add" element={<AddDepartment />} />

            <Route path="/groups" element={<Groups />} />

            <Route path="/groups/add" element={<AddGroup />} />

          </Route>

        </Routes>

      </BrowserRouter>

    </MemberProvider>
  )
}

export default App