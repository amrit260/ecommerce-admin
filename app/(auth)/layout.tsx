import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default Layout;
