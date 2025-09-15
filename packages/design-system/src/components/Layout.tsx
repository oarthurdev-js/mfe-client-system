import React from 'react'

type LayoutProps = React.HTMLAttributes<HTMLDivElement>

const Layout: React.FC<LayoutProps> = ({ className, ...rest }) => {
  return <div className={["max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className].filter(Boolean).join(' ')} {...rest} />
}

export default Layout


