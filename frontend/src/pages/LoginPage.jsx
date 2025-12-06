import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }
        if (isRegister && !name) {
            setError('Name is required for registration');
            setIsLoading(false);
            return;
        }

        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const payload = isRegister ? { name, email, password } : { email, password };

            const { data } = await axios.post(endpoint, payload);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            navigate('/dashboard');
            
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'linear-gradient(135deg, #0079bf 0%, #5067c5 100%)',
            fontFamily: 'Inter, sans-serif'
        }}>
            
            <div style={{ marginBottom: '20px', color: 'white', textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: 'white', color: '#0079bf', padding: '0 8px', borderRadius: '4px' }}>K</span> 
                    KanbanFlow
                </h1>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Manage your tasks effectively</p>
            </div>

            <div style={{ 
                background: 'white', 
                padding: '40px', 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
                width: '100%', 
                maxWidth: '400px' 
            }}>
                <h2 style={{ textAlign: 'center', color: '#172b4d', marginTop: 0 }}>
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                
                {error && (
                    <div style={{ 
                        background: '#ffebe6', color: '#de350b', 
                        padding: '10px', borderRadius: '4px', marginBottom: '20px', 
                        fontSize: '14px', textAlign: 'center', border: '1px solid #ffbdad'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {isRegister && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#5e6c84' }}>FULL NAME</label>
                            <input 
                                type="text" 
                                placeholder="e.g. John Doe" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #dfe1e6', boxSizing: 'border-box', fontSize: '14px', transition: 'border 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#0079bf'}
                                onBlur={(e) => e.target.style.borderColor = '#dfe1e6'}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#5e6c84' }}>EMAIL</label>
                        <input 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #dfe1e6', boxSizing: 'border-box', fontSize: '14px', transition: 'border 0.2s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0079bf'}
                            onBlur={(e) => e.target.style.borderColor = '#dfe1e6'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#5e6c84' }}>PASSWORD</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #dfe1e6', boxSizing: 'border-box', fontSize: '14px', transition: 'border 0.2s' }}
                            onFocus={(e) => e.target.style.borderColor = '#0079bf'}
                            onBlur={(e) => e.target.style.borderColor = '#dfe1e6'}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            padding: '12px', 
                            background: isLoading ? '#ccc' : '#0079bf', 
                            color: 'white', 
                            border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold', fontSize: '16px', marginTop: '10px',
                            transition: 'background 0.2s',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}
                    >
                        {isLoading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#172b4d' }}>
                    {isRegister ? "Already have an account? " : "Don't have an account? "}
                    <span 
                        onClick={toggleMode} 
                        style={{ color: '#0079bf', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isRegister ? 'Log In' : 'Sign Up'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;