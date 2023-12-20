import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import ManageMemberList from "../../components/ManageMemberList";

test("test should ManageMemberList match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <ManageMemberList groupId={1} creatorid={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
