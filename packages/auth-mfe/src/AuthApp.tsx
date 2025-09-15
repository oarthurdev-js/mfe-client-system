
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const AuthApp: React.FC = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      localStorage.setItem('userName', name)
      navigate('/clients')
    }
  }

  return (
    <div className='base'>
      <div className="auth-card">
        <h1 className="auth-title">
          Olá, seja bem-vindo!
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              id="name"
              type="text"
              placeholder="Digite o seu nome:"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          
          <button 
            type="submit"
            className="btn-submit"
            >
            Entrar
          </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default AuthApp