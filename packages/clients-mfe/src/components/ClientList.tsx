import React from 'react'
import { Link } from 'react-router-dom'
import type { Client } from '../types/Client'

interface ClientsListProps {
  clients: Client[]
  onDeleteClient: (id: number) => void
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onRefresh?: () => void | Promise<void>
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, onDeleteClient, isLoading, currentPage, totalPages, onPageChange, onRefresh }) => {
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${name}?`)) {
      onDeleteClient(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Clientes</h2>
        <Link
          to="/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Novo Cliente
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onRefresh && onRefresh()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Atualizar
        </button>
        {typeof currentPage === 'number' && typeof totalPages === 'number' && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Pagina {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-400 text-6xl mb-4">⏳</div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum cliente cadastrado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece adicionando seu primeiro cliente ao sistema
          </p>
          <Link
            to="/clients/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Adicionar Cliente
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {clients.map((client) => (
              <li key={client.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Salário: R$ {client.salary}
                          </p>
                          <p className="text-sm text-gray-500">
                            Valoração: {client.companyValuation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/clients/detail/${client.id}`}
                        className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/clients/edit/${client.id}`}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ClientsList