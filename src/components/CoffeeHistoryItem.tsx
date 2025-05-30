import React from 'react';
import { formatDateTime } from '../utils/helpers';
import { Coffee } from 'lucide-react';

interface CoffeeHistoryItemProps {
  date: Date;
  paid?: boolean;
}

const CoffeeHistoryItem: React.FC<CoffeeHistoryItemProps> = ({ date, paid }) => {
  return (
    <div className="py-3 border-b border-gray-100 flex items-center">
      <div className={`w-2 h-2 rounded-full mr-3 ${paid ? 'bg-green-500' : 'bg-orange-500'}`} />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <div className="font-medium text-gray-800">Coffee</div>
          <div className="text-sm text-gray-500">{formatDateTime(date)}</div>
        </div>
        <Coffee size={20} className="text-gray-400" />
      </div>
    </div>
  );
};

export default CoffeeHistoryItem;