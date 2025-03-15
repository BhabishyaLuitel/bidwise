import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeRemainingProps {
  endTime: Date;
  onEnd?: () => void;
}

export function TimeRemaining({ endTime, onEnd }: TimeRemainingProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Ended');
        onEnd?.();
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  return (
    <div className="flex items-center text-gray-900">
      <Clock className="mr-1 h-4 w-4" />
      <span className={timeLeft === 'Ended' ? 'text-red-600' : ''}>
        {timeLeft}
      </span>
    </div>
  );
}