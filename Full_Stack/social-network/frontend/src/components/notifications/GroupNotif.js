import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../store/chat-context";
import Avatar from "../modules/Avatar";

function sendChoice(choice, groupid, userid) {
  fetch(`http://localhost:8080/${choice}`, {
    mode: "cors",
    credentials: "include",
    method: "POST",
    body: JSON.stringify({
      groupid: groupid,
      userid: userid,
    }),
  })
    .then((req) => req.json())
    .then((data) => {
      console.log("group request response data: ", data);
    });
}

const GroupNotif = (props) => {
  const navigate = useNavigate();
  const { handleChatSelect } = useContext(ChatContext);
  const [isVisible] = useState(true);

  let displayMsg;
  if (localStorage.getItem("user_id") == props.groupPayload.creatorid) {
    displayMsg = `New group request FROM: ${props.groupPayload.username} INTO group ${props.groupPayload.groupname}`;
  } else {
    displayMsg = `You were invited to group ${props.groupPayload.groupname}`;
  }

  const handleChatNotiClick = () => {
    props.removeNoti();
  };

  return (
    <div>
      {isVisible && (
        <div className='dropdown-item d-flex align-items-center'>
          <div className='me-3'>
            <div className='bg-primary icon-circle' id={props.srcUser.id}>
              <Avatar width={52} src={props.srcUser.avatar}/>
            </div>
          </div>
          <div id={props.srcUser.id}>
            <p id={props.srcUser.id}>{displayMsg}</p>
            {/* ^ rewrite the message to be clearer later on */}
            <div className='groupRequestChoices' style={{ cursor: "pointer" }}>
              <button
                className='btn btn-success'
                onClick={() => {
                  handleChatNotiClick();
                  sendChoice(
                    "acceptGroup",
                    props.groupPayload.groupid,
                    props.groupPayload.userid
                  );
                }}
              >
                ACCEPT
              </button>
              <button
                className='btn btn-danger'
                onClick={() => {
                  handleChatNotiClick();
                  sendChoice(
                    "declineGroup",
                    props.groupPayload.groupid,
                    props.groupPayload.userid
                  );
                }}
              >
                DECLINE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupNotif;
