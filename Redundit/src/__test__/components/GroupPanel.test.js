import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import GroupPanel from "../../components/GroupPanel";

test("test should GroupPanel match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <GroupPanel groupId={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
