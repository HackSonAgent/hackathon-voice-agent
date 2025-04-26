import React from 'react'
import { UIProduct } from '@/types/conversation'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: UIProduct[]
  purchasedProductId: string | null
}

export function ProductGrid({
  products,
  purchasedProductId,
}: ProductGridProps): React.ReactElement {
  return (
    <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isPurchased={purchasedProductId === product.id}
        />
      ))}
    </div>
  )
}
