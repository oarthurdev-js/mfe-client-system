import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/Client'

interface ClientFormProps {
  clients?: Client[]
  onCreate?: (client: CreateClientRequest) => Promise<Client> | void
  onUpdate?: (id: number, client: UpdateClientRequest) => Promise<Client> | void
}

const ClientForm: React.FC<ClientFormProps> = ({ clients, onCreate, onUpdate }) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<CreateClientRequest>({
    name: '',
    salary: 0,
    companyValuation: 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id && clients) {
      const client = clients.find(c => c.id === parseInt(id))
      if (client) {
        setFormData({
          name: client.name,
          salary: client.salary,
          companyValuation: client.companyValuation
        })
      }
      
    }
  }, [isEditing, id, clients])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Salário deve ser maior que zero'
    }

    if (formData.companyValuation <= 0) {
      newErrors.companyValuation = 'Valor da empresa deve ser maior que zero'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Coerção final para garantir números válidos
    const payload: CreateClientRequest | UpdateClientRequest = {
      name: formData.name.trim(),
      salary: Number.isFinite(Number(formData.salary)) ? Number(formData.salary) : 0,
      companyValuation: Number.isFinite(Number(formData.companyValuation)) ? Number(formData.companyValuation) : 0
    }

    if (isEditing && id && onUpdate) {
      (onUpdate as (id: number, client: UpdateClientRequest) => void)(parseInt(id), payload as UpdateClientRequest)
    } else if (onCreate) {
      (onCreate as (client: CreateClientRequest) => void)(payload as CreateClientRequest)
    }

    navigate('/clients')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Converter para number se for salary ou companyValuation
    if (name === 'salary' || name === 'companyValuation') {
      const numValue = parseFloat(value) || 0
      setFormData(prev => ({ ...prev, [name]: numValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {isEditing ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : ''
              }`}
              placeholder="Digite o nome completo"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salário *
            </label>
            <input
              type="number"
              name="salary"
              id="salary"
              value={formData.salary}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.salary ? 'border-red-300' : ''
              }`}
              placeholder="0"
            />
            {errors.salary && (
              <p className="mt-2 text-sm text-red-600">{errors.salary}</p>
            )}
          </div>

          <div>
            <label htmlFor="companyValuation" className="block text-sm font-medium text-gray-700">
              Valoração da empresa *
            </label>
            <input
              type="number"
              name="companyValuation"
              id="companyValuation"
              value={formData.companyValuation}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.companyValuation ? 'border-red-300' : ''
              }`}
              placeholder="0"
            />
            {errors.companyValuation && (
              <p className="mt-2 text-sm text-red-600">{errors.companyValuation}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientForm