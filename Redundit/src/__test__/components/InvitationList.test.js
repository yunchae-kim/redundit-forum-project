import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import InvitationList from "../../components/InvitationList";

test("test should InvitationList match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <InvitationList groupId={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
