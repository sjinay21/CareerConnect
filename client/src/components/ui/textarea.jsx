function Textarea({value,onChange,rows="",cols="",placeholder = "",variant = "",}) {
  const variants = {
    default:"w-full border rounded-lg p-2 text-black outline-none focus:border-blue-500 resize-none",
    assign:"my-3 outline-0 text-xl p-2 border",
     primary:"w-full min-h-[500px] text-xl leading-8 text-gray-700 placeholder-gray-400 outline-none resize-none"
  };

  return (
    <textarea
      value={value}
      onChange={onChange}
    cols={cols}
      rows={rows}
      placeholder={placeholder}
      className={variants[variant]}
    />
  );
}

export default Textarea;