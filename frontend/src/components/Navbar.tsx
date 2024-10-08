import piggLogo from '../assets/logo.svg';

export default function Navbar({title}: {title: string}) {
  return (
    <div className="absolute z-50 w-full bg-slate-900 border-b border-white flex items-center p-2 justify-between">
      <div className='flex items-center gap-3'>
        <img src={piggLogo} alt="Pigg Logo" className='h-12'/>
        <h1 className='text-2xl'>P.I.G.G.</h1>
      </div>
      <h1 className='text-2xl font-bold'>{title}</h1>
      <a href="https://github.com/benjamindrussell" target="_blank" rel="noopener noreferrer">@benjamindrussell</a>
    </div>
  )
}