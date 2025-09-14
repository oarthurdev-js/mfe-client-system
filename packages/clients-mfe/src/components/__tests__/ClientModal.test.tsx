import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClientModal from '../ClientModal'
import type { Client } from '../../types/Client'

const mockClient: Client = {
  id: 1,
  name: 'John Doe',
  salary: 5000,
  companyValuation: 100000
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  mode: 'add' as const,
  onSave: vi.fn(),
  onDelete: vi.fn(),
  isLoading: false
}

describe('ClientModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Add mode', () => {
    it('should render add modal with empty form', () => {
      render(<ClientModal {...defaultProps} mode="add" />)
      
      expect(screen.getByText('Criar cliente:')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Digite o nome:')).toHaveValue('')
      expect(screen.getByPlaceholderText('Digite o salário:')).toHaveValue('')
      expect(screen.getByPlaceholderText('Digite o valor da empresa:')).toHaveValue('')
      expect(screen.getByRole('button', { name: 'Criar cliente' })).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="add" />)
      
      const submitButton = screen.getByRole('button', { name: 'Criar cliente' })
      await user.click(submitButton)
      
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('Salário deve ser um número positivo')).toBeInTheDocument()
      expect(screen.getByText('Valor da empresa deve ser um número positivo')).toBeInTheDocument()
      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })

    it('should validate numeric fields', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="add" />)
      
      await user.type(screen.getByPlaceholderText('Digite o nome:'), 'John Doe')
      await user.type(screen.getByPlaceholderText('Digite o salário:'), 'invalid')
      await user.type(screen.getByPlaceholderText('Digite o valor da empresa:'), '-100')
      
      const submitButton = screen.getByRole('button', { name: 'Criar cliente' })
      await user.click(submitButton)
      
      expect(screen.getByText('Salário deve ser um número positivo')).toBeInTheDocument()
      expect(screen.getByText('Valor da empresa deve ser um número positivo')).toBeInTheDocument()
      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })

    it('should submit valid form data', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="add" />)
      
      await user.type(screen.getByPlaceholderText('Digite o nome:'), 'John Doe')
      await user.type(screen.getByPlaceholderText('Digite o salário:'), '5000')
      await user.type(screen.getByPlaceholderText('Digite o valor da empresa:'), '100000')
      
      const submitButton = screen.getByRole('button', { name: 'Criar cliente' })
      await user.click(submitButton)
      
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        name: 'John Doe',
        salary: 5000,
        companyValuation: 100000
      })
    })

    it('should clear errors when user types', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="add" />)
      
      // Trigger validation errors
      const submitButton = screen.getByRole('button', { name: 'Criar cliente' })
      await user.click(submitButton)
      
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      
      // Type in name field
      await user.type(screen.getByPlaceholderText('Digite o nome:'), 'John')
      
      expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument()
    })
  })

  describe('Edit mode', () => {
    it('should render edit modal with pre-filled form', () => {
      render(<ClientModal {...defaultProps} mode="edit" client={mockClient} />)
      
      expect(screen.getByText('Editar cliente:')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument()
      expect(screen.getByDisplayValue('100000')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Editar cliente' })).toBeInTheDocument()
    })

    it('should submit updated form data', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="edit" client={mockClient} />)
      
      const nameInput = screen.getByDisplayValue('John Doe')
      await user.clear(nameInput)
      await user.type(nameInput, 'Jane Doe')
      
      const salaryInput = screen.getByDisplayValue('5000')
      await user.clear(salaryInput)
      await user.type(salaryInput, '6000')
      
      const submitButton = screen.getByRole('button', { name: 'Editar cliente' })
      await user.click(submitButton)
      
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        name: 'Jane Doe',
        salary: 6000,
        companyValuation: 100000
      })
    })
  })

  describe('Delete mode', () => {
    it('should render delete confirmation', () => {
      render(<ClientModal {...defaultProps} mode="delete" client={mockClient} />)
      
      expect(screen.getByText('Excluir cliente:')).toBeInTheDocument()
      expect(screen.getByText(/Você está prestes a excluir o cliente:/)).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
    })

    it('should call onDelete when confirmed', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="delete" client={mockClient} />)
      
      const deleteButton = screen.getByRole('button', { name: 'Excluir' })
      await user.click(deleteButton)
      
      expect(defaultProps.onDelete).toHaveBeenCalledWith(1)
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('should not show form fields in delete mode', () => {
      render(<ClientModal {...defaultProps} mode="delete" client={mockClient} />)
      
      expect(screen.queryByPlaceholderText('Digite o nome:')).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Digite o salário:')).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Digite o valor da empresa:')).not.toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should disable inputs and show loading text when isLoading is true', () => {
      render(<ClientModal {...defaultProps} mode="add" isLoading={true} />)
      
      expect(screen.getByPlaceholderText('Digite o nome:')).toBeDisabled()
      expect(screen.getByPlaceholderText('Digite o salário:')).toBeDisabled()
      expect(screen.getByPlaceholderText('Digite o valor da empresa:')).toBeDisabled()
      
      const submitButton = screen.getByRole('button', { name: 'Processando...' })
      expect(submitButton).toBeDisabled()
    })

    it('should show loading text for different modes', () => {
      const { rerender } = render(<ClientModal {...defaultProps} mode="add" isLoading={true} />)
      expect(screen.getByRole('button', { name: 'Processando...' })).toBeInTheDocument()
      
      rerender(<ClientModal {...defaultProps} mode="edit" client={mockClient} isLoading={true} />)
      expect(screen.getByRole('button', { name: 'Processando...' })).toBeInTheDocument()
      
      rerender(<ClientModal {...defaultProps} mode="delete" client={mockClient} isLoading={true} />)
      expect(screen.getByRole('button', { name: 'Processando...' })).toBeInTheDocument()
    })
  })

  describe('Form reset', () => {
    it('should reset form when switching from edit to add mode', () => {
      const { rerender } = render(
        <ClientModal {...defaultProps} mode="edit" client={mockClient} />
      )
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      
      rerender(<ClientModal {...defaultProps} mode="add" />)
      
      expect(screen.getByPlaceholderText('Digite o nome:')).toHaveValue('')
    })

    it('should populate form when switching to edit mode', () => {
      const { rerender } = render(<ClientModal {...defaultProps} mode="add" />)
      
      expect(screen.getByPlaceholderText('Digite o nome:')).toHaveValue('')
      
      rerender(<ClientModal {...defaultProps} mode="edit" client={mockClient} />)
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should handle onSave errors gracefully', async () => {
      const user = userEvent.setup()
      const mockOnSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      
      render(<ClientModal {...defaultProps} mode="add" onSave={mockOnSave} />)
      
      await user.type(screen.getByPlaceholderText('Digite o nome:'), 'John Doe')
      await user.type(screen.getByPlaceholderText('Digite o salário:'), '5000')
      await user.type(screen.getByPlaceholderText('Digite o valor da empresa:'), '100000')
      
      const submitButton = screen.getByRole('button', { name: 'Criar cliente' })
      await user.click(submitButton)
      
      expect(mockOnSave).toHaveBeenCalled()
      // Modal should stay open on error
      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })

    it('should handle onDelete errors gracefully', async () => {
      const user = userEvent.setup()
      const mockOnDelete = vi.fn().mockRejectedValue(new Error('Delete failed'))
      
      render(<ClientModal {...defaultProps} mode="delete" client={mockClient} onDelete={mockOnDelete} />)
      
      const deleteButton = screen.getByRole('button', { name: 'Excluir' })
      await user.click(deleteButton)
      
      expect(mockOnDelete).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and structure', () => {
      render(<ClientModal {...defaultProps} mode="add" />)
      
      const nameInput = screen.getByPlaceholderText('Digite o nome:')
      const salaryInput = screen.getByPlaceholderText('Digite o salário:')
      const companyInput = screen.getByPlaceholderText('Digite o valor da empresa:')
      
      expect(nameInput).toHaveAttribute('type', 'text')
      expect(salaryInput).toHaveAttribute('type', 'number')
      expect(companyInput).toHaveAttribute('type', 'number')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ClientModal {...defaultProps} mode="add" />)
      
      const nameInput = screen.getByPlaceholderText('Digite o nome:')
      
      await user.tab()
      expect(nameInput).toHaveFocus()
      
      await user.tab()
      expect(screen.getByPlaceholderText('Digite o salário:')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByPlaceholderText('Digite o valor da empresa:')).toHaveFocus()
    })
  })
})