export function Input({label,placeholder, type, onChange,maxLength,minLength}){
    return (
        <div className="flex flex-col  w-full">
                <div className="text-lg text-gray-700 font-medium mb-2 ">{label}</div>
                <input maxLength={maxLength} minLength={minLength} type={type} placeholder={placeholder} onChange={onChange} className={`  w-full p-2 border-2`} />
              </div>
    )
}