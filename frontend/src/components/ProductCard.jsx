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
      <div className='flex flex-col justify-end  w-full h-full'>
        <div>
          <p className=" text-gray-600">${price.toFixed(2)}</p>
        </div>
      {bestseller && (
        <p className=" bg-yellow-500 w-3/4  xl:w-fit text-white text-xs uppercase px-2 py-1 rounded-full">
          Best Seller
        </p>
      )}

      </div>
      </Link>
      
      
      
    
  );
};

export default ProductCard;