import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'System initialized', time: 'Just now', read: false }
    ]);

    const addNotification = (text) => {
        const newNotification = {
            id: Date.now(),
            text,
            time: 'Just now', // In a real app, you'd use a library like date-fns
            read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAsRead,
                markAllAsRead,
                unreadCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
