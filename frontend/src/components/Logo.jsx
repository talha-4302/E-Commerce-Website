import React from 'react'

const Logo = ({ className = 'h-6 sm:h-7' }) => {
  return (
    <svg viewBox="0 0 130 28" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="22" fontFamily="'Inter', sans-serif" fontWeight="900" 
            fontSize="24" letterSpacing="-1" fill="#111">
        EZ
      </text>
      <text x="34" y="22" fontFamily="'Inter', sans-serif" fontWeight="400" 
            fontSize="24" letterSpacing="-0.5" fill="#999">
        SHOP
      </text>
    </svg>
  )
}

export default Logo
