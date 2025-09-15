import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return (
    <input
      className={[
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
        className
      ].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}

export default Input


