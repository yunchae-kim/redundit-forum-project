import { Divider } from "@blueprintjs/core";
import FlaggedList from "../components/FlaggedList";
import InvitationList from "../components/InvitationList";
import LinkButton from "../components/LinkButton";

const PostUserManage = (props) => {
  const { location: { state: { groupId } } } = props;
  return (
    <div>
      <LinkButton url={`/group/${groupId}`} text="Back" groupId={groupId} />
      <div>
        Flagged Posts
        <FlaggedList groupId={groupId} />
      </div>
      <Divider />
      <div>
        Invitations pending approval
        <InvitationList groupId={groupId} />
      </div>

    </div>
  );
};

export default PostUserManage;
