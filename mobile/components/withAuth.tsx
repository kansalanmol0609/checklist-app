import React from 'react';
import { useAuth } from '@/contexts/auth';
import LoginScreen from '@/components/LoginScreen';

// HOC to wrap protected components
function withAuth<P>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const { user } = useAuth();
        if (!user) {
            return <LoginScreen />;
        }

        return <WrappedComponent {...(props as any)} />;
    };
    return AuthenticatedComponent;
}

export default withAuth;