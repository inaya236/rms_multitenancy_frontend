const Card = ({ title, value, change, color, icon }) => {
  return (
    <div className="relative bg-white rounded-xl  p-10 m-5 shadow-sm hover:shadow-md transition overflow:hidden">

      {/* top color strip */}
      <div className={`absolute top-0 left-0 h-1 w-full ${color} rounded-t-2xl`} />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-semibold text-gray-800">
            {value}
          </h2>

          {change && (
            <span className="mt-1 inline-block text-xs font-medium text-green-600">
              {change}
            </span>
          )}
        </div>

        
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;