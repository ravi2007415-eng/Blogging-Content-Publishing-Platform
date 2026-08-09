import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Event Published!',
      message: 'National Volleyball Championship 2026 was just scheduled under Sports → Volleyball.',
      type: 'EVENT',
      timestamp: 'Just now',
      read: false,
      link: '/category/sports/volleyball'
    },
    {
      id: 2,
      title: 'Breaking Article Released',
      message: 'Alex Rivera published "Upcoming Volleyball Tournament Next Month".',
      type: 'POST',
      timestamp: '5 min ago',
      read: false,
      link: '/blog/upcoming-volleyball-tournament-next-month'
    },
    {
      id: 3,
      title: 'System Announcement',
      message: 'Keryx v2.4 Real-time Content Broadcasting system is now live across all category feeds.',
      type: 'SYSTEM',
      timestamp: '1 hour ago',
      read: true,
      link: '/'
    }
  ]);

  const [activeToast, setActiveToast] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const triggerToast = (toastData) => {
    setActiveToast(toastData);
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  const broadcastPost = (post) => {
    const newNotif = {
      id: Date.now(),
      title: '⚡ New Article Published!',
      message: `"${post.title}" was just published in ${post.category?.name || 'Category'}${post.subCategoryName ? ` → ${post.subCategoryName}` : ''}.`,
      type: 'POST',
      timestamp: 'Just now',
      read: false,
      link: `/blog/${post.slug || post.id}`
    };

    setNotifications(prev => [newNotif, ...prev]);
    triggerToast({
      title: newNotif.title,
      message: newNotif.message,
      type: 'POST'
    });
  };

  const broadcastEvent = (event) => {
    const newNotif = {
      id: Date.now(),
      title: '📅 New Upcoming Event!',
      message: `"${event.title}" scheduled for ${event.eventDate} in ${event.categoryName} → ${event.subCategoryName}.`,
      type: 'EVENT',
      timestamp: 'Just now',
      read: false,
      link: `/events`
    };

    setNotifications(prev => [newNotif, ...prev]);
    triggerToast({
      title: newNotif.title,
      message: newNotif.message,
      type: 'EVENT'
    });
  };

  const broadcastAnnouncement = (messageText) => {
    const newNotif = {
      id: Date.now(),
      title: '📢 Admin Alert',
      message: messageText,
      type: 'ANNOUNCEMENT',
      timestamp: 'Just now',
      read: false,
      link: '/'
    };

    setNotifications(prev => [newNotif, ...prev]);
    triggerToast({
      title: newNotif.title,
      message: newNotif.message,
      type: 'ANNOUNCEMENT'
    });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      activeToast,
      broadcastPost,
      broadcastEvent,
      broadcastAnnouncement,
      markAllRead,
      dismissToast: () => setActiveToast(null)
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
