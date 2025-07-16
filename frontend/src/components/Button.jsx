export function Button({ text, onClick, width = 'full', hover = '', bgColor = "bg-purple-600", padding = '2' }) {
  return (
    <button
      onClick={onClick}
      className={`w-${width} p-${padding} ${bgColor} ${hover} text-white rounded-xl transition duration-300`}
    >
      {text}
    </button>
  );
}
