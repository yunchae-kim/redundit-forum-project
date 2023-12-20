import "../style/components/LinkButton.css";
import { Link } from "react-router-dom";

const LinkButton = ({ url, text, groupId }) => (
  <Link to={{ pathname: url, state: { groupId } }}>
    <button type="button" className="link-button">{text}</button>
  </Link>
);

export default LinkButton;
