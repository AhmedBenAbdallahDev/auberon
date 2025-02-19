'use client'
import Header from './CanvasMenu';

const Menu = () => {
  return (
    <div className='flex justify-between items-center w-full fixed z-50 px-12 py-6'>
        <div className='text-white text-xl font-semibold pt-9'>
            AUBERON
        </div>
        <>
            <Header />
        </>
    </div>
  )
}

export default Menu