import React from 'react';

const Bar = ({ value, maxValue, label, color }) => {
  // Calculate the height of the bar as a percentage of the maxValue
  const height = Math.round((value / maxValue) * 100);

  return (
    <div className="text-center px-1 flex flex-col justify-end flex-1">
      <div
        style={{ height: `${height}%`, backgroundColor: color }} // Set background color dynamically
        className="transition-all duration-300 ease-in-out w-full"
      ></div>
      <span className="text-xs mt-2">{label}</span>
    </div>
  );
}

const Chart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const totalValue = data.reduce((acc, current) => acc + current.value, 0); // Calculate total

  return (
    <div className="bg-white p-8 rounded-lg shadow mb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span>Total: {totalValue}</span> 
      </div>
      <p className="text-sm  border-b mb-10 w-full "></p>
      <div className="flex w-full h-96 justify-center gap-4">
        {data.map((d, i) => (
          <Bar key={i} value={d.value} maxValue={maxValue} label={d.name} color={d.color} />
        ))}
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const { companies, users } = data; 

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Chart data={data.companies} title="Companies" />
      <Chart data={data.users} title="Users" />
    </div>
  );
};

export default AdminDashboard;



const data = {
  companies: [
    { name: 'AX', value: 30, color: '#ccff33' },
    { name: 'CA', value: 50, color: '#ffff3f' },
    { name: 'DZ', value: 20, color: '#70e000' },
    { name: 'CM', value: 40, color: '#09e85e' },
    { name: 'NG', value: 60, color: '#9ef01a' },
    { name: 'US', value: 56, color: '#16c172' },
    { name: 'GH', value: 20, color: '#16c172' },
    { name: 'CH', value: 40, color: '#ffff3f' },
    { name: 'JP', value: 75, color: '#9ef01a' },
  ],
  users: [
    { name: 'AX', value: 45, color: '#92e6a7' },
    { name: 'CA', value: 55, color: '#b7efc5' },
    { name: 'DZ', value: 25, color: '#d4d700' },
    { name: 'CM', value: 35, color: '#88d498' },
    { name: 'NG', value: 65, color: '#2dc653' },
    { name: 'US', value: 25, color: '#bfd200' },
    { name: 'GH', value: 75, color: '#bfd200' },
    { name: 'CH', value: 45, color: '#ffff3f' },
    { name: 'JP', value: 75, color: '#9ef01a' },
  ],
};
