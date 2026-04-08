import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ _id, name, price, image, bestseller }) => {
  return (
    
      <Link to={`/product/${_id}`} className=" rounded-lg p-4 flex flex-col items-center gap-2 shadow-md hover:scale-102 transition-transform  ">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain rounded-md mb-2"
        />
        
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <div className='flex justify-between items-end w-full h-full'>
        <p className=" text-gray-600">${price.toFixed(2)}</p>
      {bestseller && (
        <span className=" bg-yellow-500 text-white text-xs uppercase px-2 py-1 rounded-full">
          Bestseller
        </span>
      )}

      </div>
      </Link>
      
      
      
    
  );
};

export default ProductCard;