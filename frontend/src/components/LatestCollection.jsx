import React, { useState, useEffect, useContext } from 'react'
import Title from './Title';
import ProductCard from './ProductCard';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext.js';

const LatestCollection = () => {
    const { backendUrl } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLatestProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/product/latest`);
            if (response.data.success) {
                const normalized = response.data.products.map(p => ({
                    ...p,
                    _id: p.id,
                    image: p.image ? [p.image] : [],
                }));
                setLatestProducts(normalized);
            }
        } catch (error) {
            console.error("Error fetching latest products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestProducts();
    }, []);

    if (loading) {
        return (
            <div className="my-10 flex justify-center items-center py-20">
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black'></div>
            </div>
        );
    }

    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1="Latest" text2="Collections" />
                <p className='text-center py-2 text-[16px]'>Browse our newest arrivals, curated just for you.</p>

            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {latestProducts.map(product => (
                    <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        image={product.image[0]}
                        bestseller={product.bestseller}
                    />
                ))}
            </div>
        </div>
    );
};

export default LatestCollection

