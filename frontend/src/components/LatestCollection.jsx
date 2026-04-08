import React from 'react'
import Title from './Title';
import ProductCard from './ProductCard';
import { products } from '../assets/assets';

const LatestCollection = () => {

    const latestProducts = products.slice(0, 8); // Limit to 8 products

    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1="Latest" text2="Collections" />
                <p className='text-center py-2 text-[16px]'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem, hic.</p>

            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {latestProducts.map(product => (
                    <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        image={product.image[0]} // Use the first image
                        bestseller={product.bestseller}
                    />
                ))}
            </div>
        </div>
    );
};

export default LatestCollection
