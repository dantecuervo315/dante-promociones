'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function Header() {
    const { items } = useCart();
    const [theme, setTheme] = useState('light');
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <header className="header glass">
            <Link href="/" style={{ textDecoration: 'none' }}>
                <h1 className="title-gradient" style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', cursor: 'pointer' }}>
                    LA LUZ DE DANTE
                </h1>
            </Link>
            <nav>
                <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', alignItems: 'center' }}>
                    <li><Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Inicio</Link></li>
                    <li><Link href="/productos" style={{ textDecoration: 'none', color: 'inherit' }}>Productos</Link></li>
                    <li>
                        <button onClick={toggleTheme} style={{
                            background: 'none',
                            border: '1px solid var(--border)',
                            color: 'inherit',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </li>
                    <li>
                        <Link href="/carrito" style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
                            🛒
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-15px',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 6px',
                                    fontSize: '0.7rem'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </li>
                    <li>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button style={{
                                    background: 'none',
                                    border: '1px solid var(--primary)',
                                    color: 'var(--primary)',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer'
                                }}>
                                    Ingresar
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
