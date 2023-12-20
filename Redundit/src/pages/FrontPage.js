import { useEffect, useState } from "react";
import { Button, ButtonGroup, InputGroup } from "@blueprintjs/core";
import GroupPanel from "../components/GroupPanel";
import NavBar from "../components/NavBar";
import GroupList from "../components/GroupList";
import LinkButton from "../components/LinkButton";
import { getPublicGroups } from "../utility/axiosGroup";
import httpClient from "../utility/auth.helper";
import "../style/pages/FrontPage.css";
import "../style/pages/Global.css";
import { deleteNotification, getNotification } from "../utility/axiosNotification";
import { getGroupsByTag } from "../utility/axiosGrouptag";

let groupPanels;
let suggestedGroupPanels;
let notificationEntries;

const FrontPage = () => {
  const [publicGroups, setPublicGroups] = useState([]);
  const [userId, setUserId] = useState(0);
  const [rerender, setRerender] = useState(false);
  const [notification, setNotification] = useState([]);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
        getNotification(iduser).then((notificationFetched) => {
          setNotification(notificationFetched);
        });
      }
    }
  }, [userId, notification]);

  const deleteNoti = (idnotification) => {
    deleteNotification(idnotification).then(() => {
      setNotification([]);
    });
  };

  useEffect(() => {
    notificationEntries = notification.map((m) => (
      <div key={m.idnotification}>
        <div>{m.notification}</div>
        <Button text="delete notification" onClick={() => deleteNoti(m.idnotification)} />
      </div>
    ));
  }, [notification]);

  useEffect(() => {
    getPublicGroups().then((groups) => {
      setPublicGroups(groups);
    });
  }, []);

  useEffect(() => {
    groupPanels = [];
    suggestedGroupPanels = [];
    groupPanels = publicGroups.map((g) => (
      <GroupPanel groupId={g.idgroup} key={g.idgroup} />
    ));
    if (publicGroups.length > 0) {
      for (let i = 0; i < 2; i += 1) {
        const j = Math.floor(Math.random() * publicGroups.length);
        suggestedGroupPanels.push(
          <GroupPanel groupId={publicGroups[j].idgroup} key={i} />,
        );
      }
    }
    setRerender(!rerender);
  }, [publicGroups]);

  const searchGroupByTag = () => {
    if (searchTag === "") {
      groupPanels = publicGroups.map((g) => (
        <GroupPanel groupId={g.idgroup} key={g.idgroup} />
      ));
      setRerender(!rerender);
    } else {
      getGroupsByTag(searchTag).then((groupsFetched) => {
        groupPanels = groupsFetched.map((g) => (
          <GroupPanel groupId={g.idgroup} key={g.idgroup} />
        ));
        setRerender(!rerender);
      });
    }
  };

  const newest = () => {
    groupPanels = publicGroups.sort((a, b) => b.idgroup - a.idgroup).map((g) => (
      <GroupPanel groupId={g.idgroup} key={g.idgroup} />
    ));
    setRerender(!rerender);
  };

  const oldest = () => {
    groupPanels = publicGroups.sort((a, b) => a.idgroup - b.idgroup).map((g) => (
      <GroupPanel groupId={g.idgroup} key={g.idgroup} />
    ));
    setRerender(!rerender);
  };

  const alphabet = () => {
    groupPanels = publicGroups.sort((a, b) => (b.name > a.name ? -1 : 1)).map((g) => (
      <GroupPanel groupId={g.idgroup} key={g.idgroup} />
    ));
    setRerender(!rerender);
  };

  const alphabetDesc = () => {
    groupPanels = publicGroups.sort((a, b) => (a.name > b.name ? -1 : 1)).map((g) => (
      <GroupPanel groupId={g.idgroup} key={g.idgroup} />
    ));
    setRerender(!rerender);
  };

  return (
    <div className="FrontPage">
      <NavBar />
      <div className="global-container">
        <div className="FP-left global-left-panel">
          {userId !== 0
          && (
          <div className="FP-suggested">
            <div className="FP-suggested-title global-header">Suggested Groups</div>
            <div className="FP-suggested-groups">
              {suggestedGroupPanels}
            </div>
          </div>
          )}
          <div className="FP-public">
            <div className="FP-public-title global-header">Public Groups</div>
            <div>
              Sort by:
              <ButtonGroup minimal>
                <Button icon="sort-numerical-desc" onClick={() => newest()}>Newest</Button>
                <Button icon="sort-numerical" onClick={() => oldest()}>Oldest</Button>
                <Button icon="sort-alphabetical" onClick={() => alphabet()}>Alphabetical</Button>
                <Button icon="sort-alphabetical-desc" onClick={() => alphabetDesc()}>Alphabetical - desc</Button>
              </ButtonGroup>
            </div>
            <InputGroup
              id="NP-titleInputGroup"
              placeholder="GroupTags"
              large="true"
              type="text"
              onChange={(e) => setSearchTag(e.target.value)}
            />
            <Button
              id="NP-postBtn"
              text="Search"
              onClick={() => searchGroupByTag()}
            />
            <div className="FP-public-groups">
              {groupPanels}
            </div>
          </div>
        </div>
        {userId !== 0
        && (
        <div className="FP-right global-right-panel">
          <div>
            Notification:
            {" "}
            {notificationEntries}
          </div>
          <LinkButton url="/creategroup" text="Create Group" />
          <GroupList userId={userId} />
        </div>
        )}
      </div>
    </div>
  );
};

export default FrontPage;
