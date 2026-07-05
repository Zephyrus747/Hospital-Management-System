import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AppContext';
import { authService } from '../services/api';

vi.mock('../services/api', () => ({
  authService: { login: vi.fn() },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  test('renders username and password fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('e.g. jdorian')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  // test('quick-fill shortcut fills the form fields', () => {
  //   renderLogin();
  //   fireEvent.click(screen.getByText('admin'));

  //   expect(screen.getByPlaceholderText('e.g. jdorian')).toHaveValue('admin');
  //   expect(screen.getByPlaceholderText('••••••••')).toHaveValue('admin123');
  // });

  test('shows an error message when authService.login rejects', async () => {
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('e.g. jdorian'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Sign in →'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});