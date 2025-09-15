declare module 'authMfe/AuthApp' {
  import { ComponentType } from 'react'
  const AuthApp: ComponentType
  export default AuthApp
}

declare module 'clientsMfe/ClientsApp' {
  import { ComponentType } from 'react'
  const ClientsApp: ComponentType
  export default ClientsApp
}

declare module 'designSystem/Button' {
  import { ComponentType } from 'react'
  
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }
  
  const Button: ComponentType<ButtonProps>
  export default Button
}

declare module 'designSystem/Input' {
  import { ComponentType } from 'react'
  
  interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number'
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    required?: boolean
    className?: string
  }
  
  const Input: ComponentType<InputProps>
  export default Input
}