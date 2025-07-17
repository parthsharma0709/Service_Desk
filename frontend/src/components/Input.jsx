export const Input = ({ label, placeholder, type, onChange }) => {
  return (
    <div className='flex flex-col  gap-2'>
      <label className='text-gray-700 font-medium'>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent'
      />
    </div>
  );
};
