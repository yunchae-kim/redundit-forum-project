import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import PrivateGroupInviteList from "../../components/PrivateGroupInviteList";

test("test should PrivateGroupInviteList match snapshot", async () => {
  const tree = renderer.create(
    <PrivateGroupInviteList groupId={1} />,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
