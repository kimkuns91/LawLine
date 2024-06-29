import { cn } from '@/utils/style';
import { FaSpinner } from 'react-icons/fa';

interface SpinnerProps {
  colors?: string;
}
const Spinner: React.FC<SpinnerProps> = ({ colors }) => {
  return (
    <FaSpinner
      className={cn(
        'animate-spin',
        colors ? `text-[${colors}]` : 'text-slate-700'
      )}
      aria-label="Loading spinner"
    />
  );
};

export default Spinner;
