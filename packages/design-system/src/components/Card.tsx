import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card: React.FC<CardProps> = ({ className, ...rest }) => {
  return <div className={["bg-white shadow rounded-lg p-6", className].filter(Boolean).join(' ')} {...rest} />
}

export default Card


