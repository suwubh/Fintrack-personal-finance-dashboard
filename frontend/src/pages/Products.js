import React, { useEffect, useState } from 'react';
import { authFetch, handleError } from '../utils';

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await authFetch('/products', { method: 'GET' });
                const data = await res.json();

                if (data.success) {
                    setProducts(data.data);
                } else {
                    handleError(data.message || 'Failed to fetch products');
                }
            } catch (err) {
                handleError('Error fetching products');
                console.error(err);
            }
        };

        loadProducts();
    }, []);

    return (
        <div>
            <h1>Your Products</h1>
            {products.length > 0 ? (
                <ul>
                    {products.map((prod, i) => (
                        <li key={i}>{prod.name} - ${prod.price}</li>
                    ))}
                </ul>
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
}

export default Products;
