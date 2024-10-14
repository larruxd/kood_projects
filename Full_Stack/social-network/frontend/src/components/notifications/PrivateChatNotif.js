import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../store/chat-context";
import Avatar from "../modules/Avatar";

const PrivateChatNotif = (props) => {
  const navigate = useNavigate();
  const { handleChatSelect } = useContext(ChatContext);
  const [isVisible] = useState(true);

  const handleChatNotiClick = () => {
    props.removeNoti();
    handleChatSelect(props.srcUser.id, props.srcUser.fname, false);
    navigate(`/chat/`);
  };

  return (
    <div>
      {isVisible && (
        <div
          onClick={handleChatNotiClick}
          style={{ cursor: "pointer" }}
          className='dropdown-item d-flex align-items-center'
        >
          <div className='me-3'>
            <div className='bg-primary icon-circle' id={props.srcUser.id}>
              <Avatar width={52} src={props.srcUser.avatar}/>
            </div>
          </div>
          <div id={props.srcUser.id}>
            <p
              id={props.srcUser.id}
            >{`New message from ${props.srcUser.fname}`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChatNotif;
