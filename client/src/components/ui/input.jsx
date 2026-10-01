function Input({type = "",placeholder,value,onChange,variant="", ...props}) {
    const variants = {
    primary:"w-full border py-3 px-5 rounded-3xl hover:bg-gray-100",
    outline:"w-full border rounded-lg p-2 text-black outline-none focus:border-blue-500",
    secondary:"border border-gray-300 rounded-lg p-2 flex-1",
  };
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={variants[variant]}
      {...props}
    />
  );
}

export default Input;