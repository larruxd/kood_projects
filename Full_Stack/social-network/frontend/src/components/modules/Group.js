import { useRef, useState, useEffect, useCallback } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function sendGroupRequest(groupid, path, userid) {
  if (!path) {
    return;
  }

  const reqOptions = {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupid: groupid, userid: userid ?? 0 }),
  };

  let result = fetch(`http://localhost:8080/${path}`, reqOptions).catch((error) => {
    console.log('err: ', error);
  });
  return result;
}

const handleKick = (e, userid, groupid) => {
  e.preventDefault();

  const reqOptions = {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupid: groupid, userid: userid }),
  };

  let result = fetch(`http://localhost:8080/kickFromGroup`, reqOptions).catch((error) => {
    console.log('err: ', error);
  });
  return result;
};

export function GroupMemberList({ members, id }) {
  let items = [
    <ListGroup.Item key="title" className="text-center disabled text-wrap bg-primary fw-bolder overflow-hidden  text-white">
      Group Members
    </ListGroup.Item>,
  ];

  let isUserOwner = members.find((elem) => elem.userid === parseInt(localStorage.getItem('user_id' ?? 0)) && elem.status === 3);

  members.forEach((element) => {
    let isOwner = false;
    if (element.status < 0) {
      return;
    }
    if (element.status === 3) {
      // user is owner of the group
      isOwner = true;
    }

    items.push(
      <Link className="nav-link" key={'link' + element.userid} to={'/profile/' + element.userid}>
        <ListGroup.Item className={'text-break d-flex justify-content-between'} key={element.userid} action>
          <div>
            {isOwner && <i className="fas fa-crown pe-1"></i>}
            {element.firstname}
          </div>
          {isUserOwner && !isOwner && (
            <span
              onClick={(e) =>
                handleKick(e, element.userid, id).then(() => {
                })
              }
              type="span"
              className="btn btn-danger z-n2"
            >
              <i className="fas fa-times pe-1"></i>
              Kick
            </span>
          )}
        </ListGroup.Item>
      </Link>
    );
  });

  return (
    <ListGroup className="" key={'test' + id}>
      {items}
    </ListGroup>
  );
}

export function JoinButton({ members, userid, groupid, callback, creator }) {
  let isUserOwner = creator === +userid;

  let buttonColor = 'rgb(0,255,0)';
  let buttonText = '👥 Join Group';
  let path = 'sendGroupRequest';

  if (isUserOwner) {
    // Current user is the group leader
    buttonColor = 'rgb(0,255,0)';
    buttonText = '👑 Leader';
    path = '';
  } // i think don't need this anymore

  members.forEach((element) => {
    if (element.userid !== parseInt(userid)) {
      return;
    }
    if (element.status !== undefined && element.status >= 0 && element.status !== 3) {
      buttonColor = 'rgb(255,0,0)';
      buttonText = '⛔ Leave Group';
      path = 'leaveGroup';
    } else if (element.status === -1) {
      buttonColor = 'rgb(255,200,0)';
      buttonText = '⌛ Cancel request';
      path = 'cancelGroupRequest';
    } else if (element.status === 3) {
      buttonColor = 'rgb(0,255,0)';
      buttonText = '👑 Leader';
      path = '';
    } else {
      buttonColor = 'rgb(255,255,255)';
      buttonText = 'ERROR!';
      path = '';
    }
    return true;
  });

  const handleKick = () => {
    if (buttonText === '👑 Leader') {
      return;
    }
    if (path) {
      sendGroupRequest(groupid, path).then(() => {
        callback && callback();
      });
    }
  };

  return (
    <Button
      className="fs-5 fw-bolder text-wrap overflow-hidden border-color"
      variant="none"
      onClick={handleKick}
      style={{ backgroundColor: buttonColor, height: 45 }}
    >
      {buttonText}
    </Button>
  );
}
export function GroupCreateModal({ onGroupCreated }) {
  const groupNameRef = useRef('');
  const groupDescriptionRef = useRef('');

  const groupNameChangehandler = (e) => {
    groupNameRef.current = e.target.value;
  };

  const groupDescriptionChangeHandler = (e) => {
    groupDescriptionRef.current = e.target.value;
  };

  const newGroupSubmitHandler = useCallback(
    (e) => {
      e.preventDefault(); // Prevent default form submission behavior

      const regPayloadObj = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: groupNameRef.current,
          description: groupDescriptionRef.current,
        }),
      };
      fetch('http://localhost:8080/createGroup', regPayloadObj) // need to make this display the result message
        .then((req) => {
          if (req.status === 201) {
            onGroupCreated && onGroupCreated();
          } else {
            console.log('FAILED TO CREATE GROUP', req.status);
          }
        })
        .catch((err) => console.log(err));
    },
    [onGroupCreated]
  );

  return (
    <form className="createGroupForm" style={{ margin: 5, padding: 5 }} onSubmit={newGroupSubmitHandler}>
      <input
        className="form-control"
        type="text"
        placeholder="Group Name:"
        style={{ marginBottom: 5 }}
        required=""
        minLength={3}
        maxLength={200}
        defaultValue={''}
        onChange={groupNameChangehandler}
      />
      <textarea
        className="form-control"
        placeholder="Description"
        style={{ marginBottom: 0 }}
        defaultValue={''}
        required=""
        minLength={3}
        maxLength={200}
        onChange={groupDescriptionChangeHandler}
      />
      <button className="btn btn-primary" type="submit" style={{ marginTop: 10 }}>
        Create
      </button>
    </form>
  );
}
//--------Add Group Member--------
export function addGroupMember(userid, groupid) {
  return sendGroupRequest(groupid, 'sendGroupRequest', userid)
    .then((data) => {
      console.log('Add member response:', data);
    })
    .catch((error) => {
      console.error('Error adding group member:', error);
    });
}