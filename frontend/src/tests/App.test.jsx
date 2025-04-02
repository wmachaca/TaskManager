import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';

describe('App Component', () => {
  test('renders Navbar and AppRoutes', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>,
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
