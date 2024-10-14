import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../store/auth-context";
import { WebSocketContext } from "../store/websocket-context";
import AllNotificationItems from "./AllNotificationItems";

const NotificationsCenter = (props) => {
  const [showNoti, setShowNoti] = useState(false);
  const [newNoti, setNewNoti] = useState([]);
  const [showNotiBadge, setShowNotiBadge] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log("auth notif", authCtx.notif);
    if (authCtx.notif.length != 0) {
      setShowNotiBadge(true);
    }
  }, [authCtx]);

  const wsCtx = useContext(WebSocketContext);

  // Listen for new notifications in ws notificationQueue
  useEffect(() => {
    // Process the first notification in the queue
    if (wsCtx.notificationQueue.length > 0) {
      const nextNotification = wsCtx.notificationQueue[0];
      const lastCurrentNotifArr = localStorage.getItem("new_notif");
      let currentNotifArray = lastCurrentNotifArr ? JSON.parse(lastCurrentNotifArr) : [];

      const notifAlreadyExists = currentNotifArray.some(
        (noti) => noti.id === nextNotification.id
      );

      if (!notifAlreadyExists) {
        const updatedNotifArray = [nextNotification, ...currentNotifArray];
        setNewNoti(updatedNotifArray);
        localStorage.setItem("new_notif", JSON.stringify(updatedNotifArray));
      }

      wsCtx.popNotificationFromQueue(); // Remove the processed notification from the queue
      setShowNotiBadge(true);
    }
  }, [wsCtx.notificationQueue]);

  const onShowNoti = () => {
    setShowNoti((prev) => !prev);
    setShowNotiBadge(false);
  };
  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <li className='nav-item dropdown no-arrow mx-1' ref={dropdownRef}>
      <div className='nav-item dropdown no-arrow' onClick={onShowNoti}>
        <Link
          className='dropdown-toggle nav-link'
          aria-expanded='false'
          data-bs-toggle='dropdown'
          to='/'
        >
          <span
            className={`badge ${
              showNotiBadge ? "bg-danger" : "badge-gray"
            } badge-counter`}
          >
            {" "}
            {showNotiBadge && "+1"}
          </span>
          <i className='fas fa-bell fa-fw' />
        </Link>
        <div
          className='dropdown-menu dropdown-menu-end dropdown-list animated--grow-in'
          onClick={props.onClose}
        >
          <h6 className='dropdown-header'>Notifications</h6>
          <div className='dropdown-item d-flex align-items-center'>
            {newNoti && showNoti && (
              <AllNotificationItems onClick={props.onClose} />
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
export default NotificationsCenter;
