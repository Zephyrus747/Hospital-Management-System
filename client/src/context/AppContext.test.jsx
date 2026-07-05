import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AppContext';

function TestConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.username : 'none'}</span>
      <button onClick={() => login({ username: 'jdorian', role: 'doctor' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('starts with no user when sessionStorage is empty', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  test('login() updates state and persists user to sessionStorage', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByTestId('user')).toHaveTextContent('jdorian');
    expect(JSON.parse(sessionStorage.getItem('hms-user')).username).toBe('jdorian');
  });

  test('logout() clears state and removes user from sessionStorage', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText('Login'));
    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(sessionStorage.getItem('hms-user')).toBeNull();
  });
});