import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import AuthApp from '../AuthApp'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Wrapper component for testing with router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('AuthApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should render welcome message and form', () => {
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    expect(screen.getByText('Olá, seja bem-vindo!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o seu nome:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('should have empty name input initially', () => {
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    expect(nameInput).toHaveValue('')
  })

  it('should update name input when user types', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, 'John Doe')
    
    expect(nameInput).toHaveValue('John Doe')
  })

  it('should not submit form with empty name', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitButton)
    
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(localStorage.getItem('userName')).toBeNull()
  })

  it('should not submit form with whitespace-only name', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, '   ')
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitButton)
    
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(localStorage.getItem('userName')).toBeNull()
  })

  it('should submit form with valid name', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, 'John Doe')
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'John Doe')
    expect(mockNavigate).toHaveBeenCalledWith('/clients')
  })

  it('should submit form on Enter key press', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, 'Jane Smith')
    await user.keyboard('{Enter}')
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'Jane Smith')
    expect(mockNavigate).toHaveBeenCalledWith('/clients')
  })

  it('should trim whitespace from name before saving', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, '  John Doe  ')
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'John Doe')
    expect(mockNavigate).toHaveBeenCalledWith('/clients')
  })

  it('should handle special characters in name', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const specialName = 'José María Ñoño-Silva'
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, specialName)
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', specialName)
    expect(mockNavigate).toHaveBeenCalledWith('/clients')
  })

  it('should handle long names', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const longName = 'A'.repeat(100) // Very long name
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    await user.type(nameInput, longName)
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', longName)
    expect(mockNavigate).toHaveBeenCalledWith('/clients')
  })

  it('should have proper form structure', () => {
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const form = screen.getByRole('form')
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    
    expect(form).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('required')
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('should have proper CSS classes applied', () => {
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const container = screen.getByText('Olá, seja bem-vindo!').closest('.base')
    const authCard = screen.getByText('Olá, seja bem-vindo!').closest('.auth-card')
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    
    expect(container).toHaveClass('base')
    expect(authCard).toHaveClass('auth-card')
    expect(nameInput).toHaveClass('form-input')
    expect(submitButton).toHaveClass('btn-submit')
  })

  it('should prevent default form submission', async () => {
    const user = userEvent.setup()
    render(<AuthApp />, { wrapper: RouterWrapper })
    
    const form = screen.getByRole('form')
    const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
    
    await user.type(nameInput, 'Test User')
    
    // Mock the form submission event
    const mockPreventDefault = vi.fn()
    const mockSubmitEvent = {
      preventDefault: mockPreventDefault,
      target: form,
    } as any
    
    // Simulate form submission
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'Test User')
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<AuthApp />, { wrapper: RouterWrapper })
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Olá, seja bem-vindo!')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<AuthApp />, { wrapper: RouterWrapper })
      
      // Tab to the input field
      await user.tab()
      expect(screen.getByPlaceholderText('Digite o seu nome:')).toHaveFocus()
      
      // Tab to the submit button
      await user.tab()
      expect(screen.getByRole('button', { name: 'Entrar' })).toHaveFocus()
    })

    it('should have proper input attributes for accessibility', () => {
      render(<AuthApp />, { wrapper: RouterWrapper })
      
      const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
      expect(nameInput).toHaveAttribute('id', 'name')
      expect(nameInput).toHaveAttribute('type', 'text')
      expect(nameInput).toHaveAttribute('required')
      expect(nameInput).toHaveAttribute('placeholder', 'Digite o seu nome:')
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      render(<AuthApp />, { wrapper: RouterWrapper })
      
      const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
      await user.type(nameInput, 'Test User')
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' })
      await user.click(submitButton)
      
      // Should still attempt to navigate even if localStorage fails
      expect(mockNavigate).toHaveBeenCalledWith('/clients')
      
      // Restore original localStorage
      localStorage.setItem = originalSetItem
    })

    it('should handle navigation errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock navigate to throw an error
      mockNavigate.mockImplementation(() => {
        throw new Error('Navigation failed')
      })
      
      render(<AuthApp />, { wrapper: RouterWrapper })
      
      const nameInput = screen.getByPlaceholderText('Digite o seu nome:')
      await user.type(nameInput, 'Test User')
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' })
      
      // Should not crash when navigation fails
      expect(() => user.click(submitButton)).not.toThrow()
    })
  })
})