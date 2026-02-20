import '../../styles/globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Providers from '@/components/Providers'

export const metadata = {
    title: 'LA LUZ DE DANTE | Tienda Premium',
    description: 'Belleza, moda y tecnología en un solo lugar.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="es">
            <body>
                <Providers>
                    <Header />
                    <main className="container">
                        {children}
                    </main>
                    <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                        <p>&copy; 2026 Dante Promociones. Todos los derechos reservados.</p>
                    </footer>
                </Providers>
            </body>
        </html>
    )
}
