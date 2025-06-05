import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    try {
      setLoading(true);
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-teal-600 rounded-lg mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isResettingPassword 
              ? 'Reset your password'
              : isLogin 
                ? 'Sign in to your account' 
                : 'Create a new account'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isResettingPassword
              ? 'Enter your email to receive a password reset link'
              : isLogin 
                ? 'Enter your details to access your documents' 
                : 'Sign up to start creating collaborative documents'}
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-md rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}
          
          <form onSubmit={isResettingPassword ? handlePasswordReset : handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email address"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                fullWidth
              />
            </div>
            
            {!isResettingPassword && (
              <div>
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  fullWidth
                />
              </div>
            )}
            
            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full"
              >
                {isResettingPassword 
                  ? 'Send reset link'
                  : isLogin 
                    ? 'Sign in' 
                    : 'Sign up'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            {isLogin && !isResettingPassword && (
              <button 
                type="button"
                onClick={() => setIsResettingPassword(true)}
                className="text-sm text-teal-600 hover:text-teal-800 block w-full"
              >
                Forgot your password?
              </button>
            )}
            
            <button 
              type="button" 
              onClick={() => {
                setIsResettingPassword(false);
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-sm text-teal-600 hover:text-teal-800 block w-full"
            >
              {isResettingPassword
                ? 'Back to sign in'
                : isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;