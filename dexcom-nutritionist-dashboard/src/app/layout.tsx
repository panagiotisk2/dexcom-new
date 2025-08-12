import './globals.css';

export const metadata = {
  title: process.env.NEXT_PUBLIC_BRAND_NAME || 'CGM Nutritionist Dashboard',
  description: 'Brandable CGM analytics for nutritionists'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav className="nav">
            <div className="brand-preview">
              <span className="brand-dot" />
              <span className="brand">{process.env.NEXT_PUBLIC_BRAND_NAME || 'YourBrand'}</span>
            </div>
            <span className="badge">Demo</span>
            <a href="/admin" className="badge">Admin</a>
          </nav>
          {children}
          <footer className="subtle" style={{marginTop:24, fontSize:12}}>
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND_NAME || 'YourBrand'} — Demo build.
          </footer>
        </div>
      </body>
    </html>
  );
}
