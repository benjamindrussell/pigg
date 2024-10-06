import { FormEvent, useState } from 'react';
import ImportGraph from './components/ImportGraph';
import Navbar from './components/Navbar';
import { Undo2 } from 'lucide-react';

function App() {
  const [filePath, setFilePath] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilePath(inputValue);
  };

  const handleClick = () => {
    setFilePath('');
  }

  function getTitle(): string {
    const tokens = filePath.split("/");
    return tokens[tokens.length - 1];
  }

  return (
    <div className='text-white font-mono'>
      <Navbar title={getTitle()}/>
      {filePath ?
        <div className='relative'>
          <button onClick={handleClick} className='absolute flex top-[70px] left-1 z-40 items-center justify-evenly border-2 rounded-md font-bold px-1'>back <Undo2 /></button>
          <ImportGraph filePath={filePath} />
        </div> :
        <div className='w-screen h-screen flex items-center justify-center'>
          <form onSubmit={handleSubmit} className='flex gap-2 items-center'>
              <label htmlFor="singleInput">
                File Path:
              </label>
              <input
                type="text"
                id="singleInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='text-black w-[400px] min-w-60 rounded-md p-1'
                required
              />
            <button type="submit" className='w-20 border-2 rounded-md font-bold'>Submit</button>
          </form>
        </div>
      }
    </div>
  );
}

export default App;