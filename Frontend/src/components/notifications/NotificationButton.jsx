function NotificationButton({ notifications, onMarkAllRead }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  function handleToggle() {
    const nextOpenState = !isOpen;
    setIsOpen(nextOpenState);

    // Simple read behavior: opening the dropdown marks all notifications as read.
    if (nextOpenState) {
      onMarkAllRead();
    }
  }

  return (
    <div className="notification-area">
      <button
        className="notification-button"
        type="button"
        onClick={handleToggle}
        aria-label="Open notifications"
      >
        <span className="bell-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifications</strong>
            <span>{notifications.length} total</span>
          </div>

          {notifications.length === 0 ? (
            <p className="empty-notification">No notifications yet.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={notification.isRead ? "notification-item" : "notification-item unread"}
                >
                  <span className="notification-dot-small" aria-hidden="true"></span>
                  <span>
                    <strong>{notification.message}</strong>
                    <small>{notification.date}</small>
                    <em className="notification-status">
                      {notification.isRead ? "Read" : "Unread"}
                    </em>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
