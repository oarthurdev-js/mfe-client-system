import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should apply primary variant by default', () => {
    render(<Button>Primary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white')
  })

  it('should apply secondary variant correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-100', 'hover:bg-gray-200', 'text-gray-900')
  })

  it('should apply danger variant correctly', () => {
    render(<Button variant="danger">Danger Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700', 'text-white')
  })

  it('should apply medium size by default', () => {
    render(<Button>Medium Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
  })

  it('should apply small size correctly', () => {
    render(<Button size="sm">Small Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-3', 'py-1', 'text-sm')
  })

  it('should apply large size correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-5', 'py-3', 'text-base')
  })

  it('should merge custom className with default classes', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('inline-flex', 'items-center', 'custom-class')
  })

  it('should handle onClick events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Clickable Button</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not trigger onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply all props combinations correctly', () => {
    render(
      <Button 
        variant="danger" 
        size="lg" 
        className="extra-class"
        type="submit"
        disabled
      >
        Complex Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600', 'px-5', 'py-3', 'extra-class')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()
  })

  it('should support focus states', () => {
    render(<Button>Focusable Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2')
  })

  it('should have proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        Text Content
      </Button>
    )
    
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text Content')).toBeInTheDocument()
  })

  it('should handle form submission', () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())
    
    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit</Button>
      </form>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  describe('className utility function', () => {
    it('should filter out falsy values', () => {
      render(<Button className={undefined}>Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button.className).not.toContain('undefined')
    })
  })
})