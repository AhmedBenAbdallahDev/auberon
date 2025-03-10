import React from 'react'
const Header = () => {
  return (
    <header className='w-full flex items-center relative justify-between'>
        <div className='flex'>
            <span className='text-2xl font-bold'>AUBERON</span>
        </div>
        <div className='flex items-center gap-10'>
            <ul className='flex gap-10 text-gray-400'>
                <li>Home</li>
                <li>Service</li>
                <li>Project</li>
                <li>Contact</li>
            </ul>
            <span className='text-xl font-semibold'>Let&apos;s Talk</span>
        </div>
        
    </header>
  )
}

export default Header