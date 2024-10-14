import { useEffect, useState } from "react";
import NotificationItems from "./NotificationItems";

const AllNotificationItems = (props) => {
  const [notiArr, setNotiArr] = useState([]);

  useEffect(() => {
    const storedNotif = JSON.parse(localStorage.getItem("new_notif")) || []; // Add a default value here
    setNotiArr(storedNotif);
  }, []);

  useEffect(() => {
    // This will always be an array, so no error should occur here.
    localStorage.setItem("new_notif", JSON.stringify(Object.values(notiArr)));
  }, [notiArr]);

  const removeNotification = (notifId) => {
    const updatedNotiArr = notiArr.filter((noti) => noti.id !== notifId);
    setNotiArr(updatedNotiArr);
    localStorage.setItem("new_notif", JSON.stringify(updatedNotiArr));
  };

  return (
    <div>
      {notiArr &&
        notiArr.map((notiItem) => {
          return (
            <NotificationItems
              key={notiItem.id}
              id={notiItem.id}
              type={notiItem.type}
              targetId={notiItem.targetid}
              sourceId={notiItem.sourceid}
              createdAt={notiItem.createdat}
              groupId={notiItem.groupid}
              groupName={notiItem.groupname}
              groupPayload={notiItem.groupPayload}
              onRemoveNotification={() => removeNotification(notiItem.id)}
            />
          );
        })}
    </div>
  );
};

export default AllNotificationItems;
