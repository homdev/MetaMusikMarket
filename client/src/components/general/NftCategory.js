import React from 'react';
import { Link } from 'react-router-dom';
import { formatCategory } from '../../helpers/utils';

function Category({ category }) {
    return (
        <p className='text-sm text-white badge bg-primary fw-normal d-flex align-items-center mb-0'>
            {category ? (
                <Link className='text-white' to={`/categories/${category}`}>
                    <span className='text-white lh-reset'>{formatCategory(category)}</span>
                </Link>
            ) : (
                <span className='text-white'>No Cateogry</span>
            )}
        </p>
    );
}

export default Category;
