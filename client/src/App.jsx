import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { CardSkeleton } from './components/LoadingSkeleton';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VendorList = lazy(() => import('./pages/vendors/VendorList'));
const VendorDetail = lazy(() => import('./pages/vendors/VendorDetail'));
const VendorCreate = lazy(() => import('./pages/vendors/VendorCreate'));
const RFQList = lazy(() => import('./pages/rfq/RFQList'));
const RFQCreate = lazy(() => import('./pages/rfq/RFQCreate'));
const RFQDetail = lazy(() => import('./pages/rfq/RFQDetail'));
const QuoteSubmit = lazy(() => import('./pages/quotations/QuoteSubmit'));
const QuoteCompare = lazy(() => import('./pages/quotations/QuoteCompare'));
const Approvals = lazy(() => import('./pages/Approvals'));
const PurchaseOrders = lazy(() => import('./pages/PurchaseOrders'));
const Invoices = lazy(() => import('./pages/Invoices'));
const ActivityLog = lazy(() => import('./pages/ActivityLog'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ADMIN = ['ADMIN'];
const MANAGER = ['ADMIN', 'MANAGER'];
const OFFICER = ['ADMIN', 'PROCUREMENT_OFFICER'];
const OFFICER_PLUS = ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'];
const ALL = ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'];

function Fallback() {
  return <div className="p-8 grid grid-cols-1 gap-4"><CardSkeleton /><CardSkeleton /></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute roles={ALL}><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/vendors" element={
              <ProtectedRoute roles={OFFICER}><VendorList /></ProtectedRoute>
            } />
            <Route path="/vendors/new" element={
              <ProtectedRoute roles={ADMIN}><VendorCreate /></ProtectedRoute>
            } />
            <Route path="/vendors/:id" element={
              <ProtectedRoute roles={OFFICER}><VendorDetail /></ProtectedRoute>
            } />

            <Route path="/rfq" element={<RFQList />} />
            <Route path="/rfq/new" element={
              <ProtectedRoute roles={['ADMIN', 'PROCUREMENT_OFFICER']}><RFQCreate /></ProtectedRoute>
            } />
            <Route path="/rfq/:id" element={<RFQDetail />} />
            <Route path="/rfq/:rfqId/quote" element={
              <ProtectedRoute roles={['VENDOR']}><QuoteSubmit /></ProtectedRoute>
            } />
            <Route path="/rfq/:rfqId/compare" element={
              <ProtectedRoute roles={OFFICER}><QuoteCompare /></ProtectedRoute>
            } />

            <Route path="/approvals" element={
              <ProtectedRoute roles={MANAGER}><Approvals /></ProtectedRoute>
            } />
            <Route path="/purchase-orders" element={
              <ProtectedRoute roles={ALL}><PurchaseOrders /></ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute roles={ALL}><Invoices /></ProtectedRoute>
            } />
            <Route path="/activity-log" element={
              <ProtectedRoute roles={OFFICER_PLUS}><ActivityLog /></ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute roles={MANAGER}><Reports /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
