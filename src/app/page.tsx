import Link from 'next/link'

export default function Home() {
    return (
        <div className="home-container">
            {/* Hero Section - Promoción Principal */}
            <section className="glass hero-promo" style={{
                margin: '2rem 0',
                padding: '4rem 2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid var(--primary)'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Oferta de Lanzamiento 🚀
                    </span>
                    <h1 className="title-gradient" style={{ fontSize: '4rem', margin: '1.5rem 0', lineHeight: '1.1' }}>
                        DANTE <br /> PROMOCIONES
                    </h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '500' }}>
                        ¡Hasta <span style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800' }}>50% OFF</span> en toda la tienda!
                    </p>
                    <Link href="/productos?categoria=promociones">
                        <button className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                            Ver Ofertas Ahora
                        </button>
                    </Link>
                </div>
                {/* Decoración de fondo */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(100px)',
                    opacity: 0.2,
                    borderRadius: '50%'
                }}></div>
            </section>

            {/* Categorías Destacadas */}
            <h2 style={{ textAlign: 'center', margin: '3rem 0 1.5rem' }}>Explora nuestras Categorías</h2>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <Link href="/productos?categoria=belleza" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass category-card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💄</div>
                        <h3 className="title-gradient">Belleza</h3>
                        <p>Cosméticos y cuidado personal de alta gama.</p>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '1rem', display: 'block' }}>Explorar →</span>
                    </div>
                </Link>

                <Link href="/productos?categoria=moda" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass category-card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👗</div>
                        <h3 className="title-gradient">Moda</h3>
                        <p>Ropa y accesorios para cada ocasión.</p>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '1rem', display: 'block' }}>Explorar →</span>
                    </div>
                </Link>

                <Link href="/productos?categoria=tecnologia" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass category-card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
                        <h3 className="title-gradient">Tecnología</h3>
                        <p>Los gadgets más innovadores del mercado.</p>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '1rem', display: 'block' }}>Explorar →</span>
                    </div>
                </Link>
            </section>

            {/* Banner Secundario - Envío */}
            <section className="glass" style={{ margin: '4rem 0', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', border: '1px dashed var(--primary)' }}>
                <div style={{ fontSize: '2.5rem' }}>🚚</div>
                <div>
                    <h3 style={{ margin: 0 }}>Envíos a todo el país</h3>
                    <p style={{ margin: 0, opacity: 0.8 }}>O retira gratis en nuestra tienda en Bogotá.</p>
                </div>
            </section>
        </div>
    )
}
