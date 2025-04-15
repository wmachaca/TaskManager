import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

describe('HomePage Component', () => {
  test('renders the title and description', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Check if title exists
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();

    // Check if description exists
    expect(screen.getByText(/Organize your work and life/i)).toBeInTheDocument();
  });

  test('shows login prompt when clicking "Get Started"', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Find and click the "Get Started" button
    fireEvent.click(screen.getByText(/Get Started/i));

    // Check if login prompt appears
    expect(screen.getByText(/Please log in to view your tasks/i)).toBeInTheDocument();

    // Check if Login and Register buttons appear
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
});
