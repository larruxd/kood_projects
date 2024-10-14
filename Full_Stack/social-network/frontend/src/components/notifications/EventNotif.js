import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Avatar from "../modules/Avatar";
function EventNotif(props) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const data = props.groupPayload;
  if (!data) return <div>Loading...</div>;
  function handleClick(e) {
    setIsVisible(false);
    const id = parseInt(e.target.id);
    let notifarr = JSON.parse(localStorage.getItem("new_notif"));
    let newarray = notifarr.filter((obj) => obj.groupid !== id);
    localStorage.setItem("new_notif", JSON.stringify(Object.values(newarray)));

    navigate(`/groupprofile/${id}`);
    props.removeNoti();
  }
  return (
    <div>
      {isVisible && (
        <div className='dropdown-item d-flex align-items-center'>
          <div className='me-3'>
            <Avatar width={52}/>
          </div>
          <div>
            {data && (
              <div id={data.groupid} onClick={handleClick}>
                {data.grouptitle} gained new event: {data.title}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default EventNotif;
