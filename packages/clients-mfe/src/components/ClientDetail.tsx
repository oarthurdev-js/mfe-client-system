import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { Client } from '../types/Client'

interface ClientDetailProps {
  clients: Client[]
}

const ClientDetail: React.FC<ClientDetailProps> = ({ clients }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const client = clients.find(c => c.id === parseInt(id as string))

  if (!client) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Cliente não encontrado
        </h3>
        <p className="text-gray-500 mb-4">
          O cliente que você está procurando não existe.
        </p>
        <Link
          to="/clients"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Voltar para Lista
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/clients')}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium mb-2"
          >
            ← Voltar para lista
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Detalhes do Cliente</h2>
        </div>
        <Link
          to={`/clients/edit/${client.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Editar Cliente
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header do card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{client.name}</h3>
              <p className="text-blue-100">Valoração: {client.companyValuation}</p>
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="px-6 py-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome Completo</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                {client.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                <a 
                  href="#"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Salário: R$ {client.salary}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                <a 
                  href="#"
                  className="text-blue-600 hover:text-blue-500"
                >
                  ID: {client.id}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Empresa</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                Valoração: {client.companyValuation}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Data de Cadastro</dt>
              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                {formatDate(client.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Ações */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between">
            <Link
              to="/clients"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para Lista
            </Link>
            <Link
              to={`/clients/edit/${client.id}`}
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Editar Cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDetail