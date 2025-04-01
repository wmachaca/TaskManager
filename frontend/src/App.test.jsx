import { render, screen } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';
import App from './App';

test('renders Navbar and AppRoutes', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );

  // Check if Navbar and AppRoutes render correctly by looking for specific text/elements.
  const navbarElement = screen.getByText(/Task Manager/i); // Adjust this based on actual navbar content
  expect(navbarElement).toBeInTheDocument();
});
