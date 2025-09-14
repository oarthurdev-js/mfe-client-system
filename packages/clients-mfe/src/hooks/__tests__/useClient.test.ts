import { renderHook, act } from '@testing-library/react'
import { useClients } from '../useClient'
import { apiService } from '../../../../shared/services/api'

// Mock the API service
vi.mock('../../../../shared/services/api', () => ({
  apiService: {
    getClients: vi.fn(),
    createClient: vi.fn(),
    updateClient: vi.fn(),
    deleteClient: vi.fn(),
  }
}))

const mockApiService = apiService as any

describe('useClients hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    mockApiService.getClients.mockResolvedValue({
      clients: [],
      totalPages: 1,
      currentPage: 1
    })

    const { result } = renderHook(() => useClients())

    expect(result.current.clients).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(1)
    expect(result.current.itemsPerPage).toBe(16)
  })

  it('should load clients on mount', async () => {
    const mockClients = [
      { id: 1, name: 'John Doe', salary: 5000, companyValuation: 100000 },
      { id: 2, name: 'Jane Smith', salary: 6000, companyValuation: 120000 }
    ]

    mockApiService.getClients.mockResolvedValue({
      clients: mockClients,
      totalPages: 2,
      currentPage: 1
    })

    const { result } = renderHook(() => useClients())

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockApiService.getClients).toHaveBeenCalledWith(1, 16)
    expect(result.current.clients).toEqual(mockClients)
    expect(result.current.totalPages).toBe(2)
    expect(result.current.currentPage).toBe(1)
  })

  it('should handle loading state', async () => {
    let resolvePromise: (value: any) => void
    const clientsPromise = new Promise(resolve => {
      resolvePromise = resolve
    })

    mockApiService.getClients.mockReturnValue(clientsPromise)

    const { result } = renderHook(() => useClients())

    // Should be loading initially
    expect(result.current.isLoading).toBe(true)

    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        clients: [],
        totalPages: 1,
        currentPage: 1
      })
      await clientsPromise
    })

    // Should not be loading after resolution
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch clients'
    mockApiService.getClients.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.clients).toEqual([])
  })

  it('should create a new client', async () => {
    const newClient = { name: 'New Client', salary: 7000, companyValuation: 150000 }
    const createdClient = { id: 3, ...newClient }

    mockApiService.getClients.mockResolvedValue({
      clients: [],
      totalPages: 1,
      currentPage: 1
    })
    mockApiService.createClient.mockResolvedValue(createdClient)

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await result.current.createClient(newClient)
    })

    expect(mockApiService.createClient).toHaveBeenCalledWith(newClient)
    expect(mockApiService.getClients).toHaveBeenCalledTimes(2) // Initial load + reload after create
  })

  it('should update an existing client', async () => {
    const existingClient = { id: 1, name: 'John Doe', salary: 5000, companyValuation: 100000 }
    const updatedData = { name: 'John Smith', salary: 5500, companyValuation: 110000 }
    const updatedClient = { ...existingClient, ...updatedData }

    mockApiService.getClients.mockResolvedValue({
      clients: [existingClient],
      totalPages: 1,
      currentPage: 1
    })
    mockApiService.updateClient.mockResolvedValue(updatedClient)

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for initial load
    })

    await act(async () => {
      await result.current.updateClient(1, updatedData)
    })

    expect(mockApiService.updateClient).toHaveBeenCalledWith(1, updatedData)
    expect(result.current.clients[0]).toEqual(updatedClient)
  })

  it('should delete a client', async () => {
    const clients = [
      { id: 1, name: 'John Doe', salary: 5000, companyValuation: 100000 },
      { id: 2, name: 'Jane Smith', salary: 6000, companyValuation: 120000 }
    ]

    mockApiService.getClients.mockResolvedValue({
      clients,
      totalPages: 1,
      currentPage: 1
    })
    mockApiService.deleteClient.mockResolvedValue({})

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for initial load
    })

    await act(async () => {
      await result.current.deleteClient(1)
    })

    expect(mockApiService.deleteClient).toHaveBeenCalledWith(1)
    expect(result.current.clients).toEqual([clients[1]])
  })

  it('should handle pagination', async () => {
    mockApiService.getClients.mockResolvedValue({
      clients: [],
      totalPages: 3,
      currentPage: 2
    })

    const { result } = renderHook(() => useClients())

    await act(async () => {
      result.current.goToPage(2)
    })

    expect(mockApiService.getClients).toHaveBeenCalledWith(2, 16)
    expect(result.current.currentPage).toBe(2)
  })

  it('should change items per page', async () => {
    mockApiService.getClients.mockResolvedValue({
      clients: [],
      totalPages: 1,
      currentPage: 1
    })

    const { result } = renderHook(() => useClients())

    await act(async () => {
      result.current.changeItemsPerPage(8)
    })

    expect(mockApiService.getClients).toHaveBeenCalledWith(1, 8)
    expect(result.current.itemsPerPage).toBe(8)
    expect(result.current.currentPage).toBe(1) // Should reset to page 1
  })

  it('should refresh clients', async () => {
    mockApiService.getClients.mockResolvedValue({
      clients: [],
      totalPages: 1,
      currentPage: 1
    })

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for initial load
    })

    await act(async () => {
      result.current.refreshClients()
    })

    expect(mockApiService.getClients).toHaveBeenCalledTimes(2) // Initial + refresh
  })

  it('should clear error', async () => {
    mockApiService.getClients.mockRejectedValue(new Error('Test error'))

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe('Test error')

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })

  it('should not go to invalid pages', async () => {
    mockApiService.getClients.mockResolvedValue({
      clients: [],
      totalPages: 3,
      currentPage: 1
    })

    const { result } = renderHook(() => useClients())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const initialCallCount = mockApiService.getClients.mock.calls.length

    // Try to go to invalid pages
    act(() => {
      result.current.goToPage(0) // Invalid: less than 1
      result.current.goToPage(4) // Invalid: greater than totalPages
      result.current.goToPage(1) // Invalid: same as current page
    })

    // Should not make additional API calls
    expect(mockApiService.getClients).toHaveBeenCalledTimes(initialCallCount)
  })
})