import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const normalizeUser = (userData) => {
        if (!userData) return null;

        console.log("Raw user data from backend:", userData);

        // Standardize roles
        const rawRoles = userData.role || userData.roles || userData.authorities || [];
        const roles = (Array.isArray(rawRoles) ? rawRoles : [rawRoles]).map(r => {
            let roleName = "";
            if (typeof r === 'string') {
                roleName = r;
            } else if (r && typeof r === 'object') {
                roleName = r.name || r.authority || r.roleName || "";
            }
            if (roleName && !roleName.startsWith('ROLE_')) {
                return `ROLE_${roleName.toUpperCase()}`;
            }
            return roleName.toUpperCase();
        }).filter(Boolean);

        const normalized = {
            ...userData,
            roles,
            enabled: userData.enabled ?? userData.enable ?? true
        };

        console.log("Normalized user:", normalized);
        return normalized;
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('accessToken');
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(normalizeUser(userData));
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    sessionStorage.removeItem('accessToken');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        setIsLoading(true);
        try {
            const data = await authService.login(credentials);
            let userData = data.user || data;

            // Fetch profile if roles are missing
            if (!userData.role && !userData.roles) {
                try {
                    userData = await authService.getCurrentUser();
                } catch (fetchError) {
                    console.warn("Could not fetch user profile after login", fetchError);
                }
            }

            const userToSet = normalizeUser(userData);
            setUser(userToSet);
            setIsAuthenticated(true);
            return { ...data, user: userToSet };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const registerStudent = async (data) => authService.registerStudent(data);
    const registerUniversity = async (data) => authService.registerUniversity(data);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        registerStudent,
        registerUniversity
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
