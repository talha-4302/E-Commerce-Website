import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ _id, name, price, image, bestseller }) => {
  return (

    <Link to={`/product/${_id}`} className=" rounded-lg p-4 flex flex-col  items-center gap-2 shadow-md hover:scale-102 transition-transform  ">
      <img
        src={`/assets/${image}`}
        alt={name}
        className="w-full h-full object-contain rounded-md mb-2"
      />

      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <div className='flex flex-col justify-end xl:flex-row xl:justify-between xl:items-end w-full h-full'>
        <p className=" text-gray-600">${Number(price).toFixed(2)} </p>
        {bestseller == 1 ? (
          <p className=" bg-yellow-500 w-3/4  xl:w-fit text-white text-xs uppercase px-2 py-1 rounded-full">
            Best Seller
          </p>
        ) : null}

      </div>
    </Link>




  );
};

export default ProductCard;