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
          !
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
