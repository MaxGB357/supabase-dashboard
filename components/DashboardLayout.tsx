// Dashboard layout component with header and footer
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  title = "Dashboard de Adopción de IA",
  subtitle = "Resultados de Encuestas por Institución"
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-white border-t">
        <p className="text-sm text-gray-500">
          Dashboard de Adopción de IA - MAIndset© {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
