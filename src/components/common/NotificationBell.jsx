import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import { getNotifications, markAsRead, markAllAsRead } from "../../managers/notificationManager";
import "./NotificationBell.css";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    loadNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.recentNotifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await markAsRead(notification.id);
        await loadNotifications();
      }

      // Navigate to action URL if available
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
        setDropdownOpen(false);
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAllAsRead();
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        nav
        style={{ position: "relative", cursor: "pointer" }}
        className="notification-bell-toggle"
      >
        <span style={{ fontSize: "1.2rem" }}>🔔</span>
        {unreadCount > 0 && (
          <Badge
            color="danger"
            pill
            style={{
              position: "absolute",
              top: "8px",
              right: "-8px",
              fontSize: "0.7rem",
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu end className="notification-dropdown">
        <div className="notification-header">
          <strong>Notifications</strong>
          {unreadCount > 0 && (
            <a
              href="#"
              onClick={handleMarkAllRead}
              style={{
                fontSize: "0.85rem",
                color: "var(--color-gold)",
                textDecoration: "none",
              }}
            >
              Mark all read
            </a>
          )}
        </div>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <DropdownItem disabled className="notification-empty">
              No notifications
            </DropdownItem>
          ) : (
            notifications.map((notification) => (
              <DropdownItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`notification-item ${!notification.isRead ? "unread" : ""}`}
              >
                <div className="notification-content">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{formatTime(notification.createdAt)}</div>
                </div>
                {!notification.isRead && (
                  <div className="notification-badge">
                    <span className="unread-dot"></span>
                  </div>
                )}
              </DropdownItem>
            ))
          )}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
