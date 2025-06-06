import React from 'react';
import { Coffee } from 'lucide-react';

interface CoffeeHistoryItemProps {
  date: Date;
  paid: boolean;
  onPayClick?: () => void;
}

const CoffeeHistoryItem: React.FC<CoffeeHistoryItemProps> = ({ date, paid, onPayClick }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);

  return (
    <div className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Coffee size={20} className={`mr-3 ${paid ? 'text-green-500' : 'text-orange-500'}`} />
        <div>
          <div className="text-gray-900">{formattedDate}</div>
          <div className={`text-sm ${paid ? 'text-green-500' : 'text-orange-500'}`}>
            {paid ? 'Paid' : 'Unpaid'}
          </div>
        </div>
      </div>
      {!paid && onPayClick && (
        <button
          onClick={onPayClick}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Pay
        </button>
      )}
    </div>
  );
};

export default CoffeeHistoryItem;