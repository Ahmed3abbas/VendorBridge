import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center p-4">
      <span className="material-symbols-outlined text-[80px] text-text-secondary">search_off</span>
      <div>
        <h1 className="text-headline-lg text-text-primary mb-2">Page Not Found</h1>
        <p className="text-body-md text-text-secondary max-w-sm">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button icon="home" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </div>
  );
}
