import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import GroupImg from "../assets/img/socialFav.png";
import { GroupMemberList, JoinButton } from "../modules/Group";
import { EventCard, CreateEventModal } from "../modules/GroupEvent";
import CreatePost from "../posts/CreatePost.js";
import AllPosts from "../posts/AllPosts.js";
import { GroupContext } from "../store/group-context.js";
import NotGroupMembers from "../posts/notGroupMembers";
import { PostsContext } from "../store/posts-context.js";

const GroupProfilePage = () => {
  const { groupId } = useParams();
  const [groupEvents, setGroupEvents] = useState(null);
  const [groupInfo, setGroupInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupPosts, setGroupPosts] = useState([]);
  const [userIsMember, setUserIsMember] = useState(false);

  const groupCtx = useContext(GroupContext);

  const fetchGroup = async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllGroups", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const allGroups = await response.json();
      const specificGroup = allGroups.find(
        (group) => group.id === parseInt(groupId)
      );

      if (specificGroup) {
        setGroupInfo(specificGroup);
      } else {
        throw new Error("Group not found");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupEvents = async (groupId) => {
    try {
      const resp = await fetch("http://localhost:8080/getGroupEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch events: ${resp.status}`);
      }

      const events = await resp.json();
      setGroupEvents(events);
    } catch (error) {
      console.error("Error fetching group events:", error);
    }
  };

  useEffect(() => {
    fetchGroup();
    getGroupEvents(parseInt(groupId));
    setGroupPosts(
      groupCtx.groupPostsData.filter((post) => post.group_id == groupId)
    );
  }, [groupId, groupCtx.groupPostsData]);

  // Callback function for the JoinButton
  const handleGroupUpdate = () => {
    fetchGroup(); // Re-fetch the specific group's data
  };

  // Callback function for CreateEvent modal
  const handleEventUpdate = () => {
    getGroupEvents(parseInt(groupId));
  };

  // Check if user is member of the group after group info is updated
  useEffect(() => {
    if (groupInfo.members) {
      const currentUserID = +localStorage.getItem("user_id" ?? 0);
      setUserIsMember(groupInfo.members.some(member => member.userid === currentUserID && member.status >= 0));
    }
  }, [groupInfo]);

  if (isLoading) {
    return <div>Loading group information...</div>;
  }

  if (!groupInfo) {
    return <div>Loading...</div>;
  }
  const excludeUserIds = groupInfo.members.map((member) => member.userid);
  if (groupInfo.creator) {
    excludeUserIds.push(groupInfo.creator);
  }

  return (
    <div className='container' id='mainContainer'>
      <div className='row'>
        <div
          className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4'
          id='leftColumn'
        >
          {userIsMember && <div
            className='text-start'
            id='eventsDiv'
            style={{ textAlign: "center" }}
          >
            <div>
              <a
                className='btn btn-primary btn-lg'
                data-bs-toggle='collapse'
                aria-expanded='false'
                aria-controls='collapse-1'
                href='#collapse-1'
                role='button'
                style={{ width: 100 }}
              >
                Events:
              </a>

              <span
                className='badge bg-danger badge-counter'
                style={{
                  pointerEvents: "none",
                  fontSize: 16,
                  margin: 5,
                  borderRadius: 30,
                }}
              >
                <i className='fas fa-bell fa-fw' style={{}}></i>
                {groupEvents ? groupEvents.length : 0}
              </span>

              <div className='collapse' id='collapse-1'>
                <p>Collapse content.</p>
                {/* Start: createEventDiv */}
                <CreateEventModal
                  groupId={groupId}
                  callBack={handleEventUpdate}
                />
                {/* End: createEventForm */}
                {/* Start: Events List */}
                <div
                  className='createEvent'
                  style={{
                    padding: 5,
                    boxShadow: "3px 3px 5px 5px var(--bs-body-color)",
                    marginTop: 10,
                  }}
                >
                  <h5 style={{ marginRight: 5, marginLeft: 5 }}>
                    Events List:
                  </h5>
                  {/* Start: Events list Div */}
                  <EventCard
                    groupEvents={groupEvents}
                    groupInfo={groupInfo}
                    currentUser={+localStorage.getItem("user_id" ?? 0)}
                    handleEventUpdate={handleEventUpdate}
                  />
                  {/* End: Events list Div */}
                </div>
                {/* End: Events List */}
              </div>
              {/* End: createEventDiv */}
            </div>
          </div>}
          <div
            className='text-start'
            id='group-users-list'
            style={{ marginTop: 20, textAlign: "center" }}
          >
            {/* Start: listUsers */}
            <div
              style={{
                boxShadow: "3px 3px 5px 5px var(--bs-body-color)",
                maxWidth: 250,
                marginTop: 10,
              }}
            >
              {groupInfo.members && (
                <GroupMemberList
                  members={groupInfo.members}
                  id={groupInfo.id}
                />
              )}
            </div>
            {/* End: listUsers */}
          </div>
          {userIsMember && <div
            style={{
              maxWidth: 250,
            }}
          >
            <NotGroupMembers
              excludeUsers={excludeUserIds}
              groupid={groupInfo.id}
            />
          </div>}
        </div>
        <div
          className='col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 col-xxl-8'
          id='rightColumn'
        >
          {/* Start: groupListpageDiv */}
          <div className='groupListpage'>
            <div className='text-center'>
              <h1>{groupInfo.title}</h1>
            </div>
            {/* Start: groupProfileWrapperDiv */}
            <div
              className='d-flex justify-content-between align-items-lg-center align-items-xl-center groupProfileWrapper'
              style={{
                padding: 5,
                boxShadow: "3px 3px 5px 5px var(--bs-body-color)",
                margin: 10,
              }}
            >
              {/* Start: cardProfileDiv */}
              <div
                className='d-flex align-items-xl-center cardProfileDiv'
                style={{ padding: 5 }}
              >
                <div id='groupwrapperImageDiv' className='groupWrapperImage'>
                  <img
                    className='rounded-circle'
                    style={{ width: 52, margin: 5 }}
                    src={GroupImg}
                    alt='GroupImg'
                  />
                </div>
                <div>
                  <div id='groupTitle'>
                    <h4>{groupInfo.title}</h4>
                  </div>
                  <div id='groupDesc'>
                    <span>{groupInfo.description}</span>
                  </div>
                </div>
              </div>
              {/* End: cardProfileDiv */}
              <div>
                {groupInfo.members && (
                  <JoinButton
                    members={groupInfo.members}
                    userid={localStorage.getItem("user_id" ?? 0)}
                    groupid={groupInfo.id}
                    creator={groupInfo.creator}
                    callback={handleGroupUpdate}

                    // callback={() => {RequestGroupAdditionalInfo(Array.from(groupsInfo), updateGroups)}}
                  />
                )}
              </div>
            </div>
          </div>
          {/* End: groupListpageDiv */}
          {/* Start: GroupPosts */}
          {userIsMember && <div style={{ padding: 5 }}>
            <a
              className='btn btn-primary btn-lg'
              data-bs-toggle='collapse'
              aria-expanded='false'
              aria-controls='collapse-create-post'
              href='#collapse-create-post'
              role='button'
              style={{}}
            >
              Create Post
            </a>
            <div
              className='collapse'
              id='collapse-create-post'
              style={{ padding: 5 }}
            >
              <CreatePost
                group={true}
                onCreatePost={groupCtx.onCreatePost}
                groupId={groupId}
              />
            </div>
            <AllPosts
              data={groupPosts}
              onCreateComment={groupCtx.onCreateComment}
              group={true}
              groupId={groupId}
            />
          </div>}
          {/* End: GroupPosts */}
        </div>
      </div>
    </div>
  );
};

export default GroupProfilePage;
