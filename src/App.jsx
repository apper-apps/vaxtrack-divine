import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Inventory from '@/components/pages/Inventory';
import ReceiveVaccines from '@/components/pages/ReceiveVaccines';
import Administer from '@/components/pages/Administer';
import Reports from '@/components/pages/Reports';
import VaccineLoss from '@/components/pages/VaccineLoss';
import Settings from '@/components/pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/receive" element={<ReceiveVaccines />} />
            <Route path="/administer" element={<Administer />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/loss" element={<VaccineLoss />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;