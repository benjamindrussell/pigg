import { ArrowUp } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

export default function SearchBar({ onInputUpdate }: { onInputUpdate: (data: string) => void }) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onInputUpdate(inputValue);
    console.log('sent')
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="absolute bottom-6 z-50 mx-auto w-[100vw] flex flex-row justify-center">
      <div className="w-[50vw] relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          className= "w-full py-2 pl-4 pr-12 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-blue-500"
          placeholder="Module Name"
        />
        <button
          type="submit"
          className="absolute right-2 p-1 text-white bg-pink-300 rounded-full hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </form>
  );
}