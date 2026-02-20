'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/lib/CartContext'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </ClerkProvider>
    )
}
