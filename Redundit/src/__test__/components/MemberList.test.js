import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import MemberList from "../../components/MemberList";

test("test should NavBar match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <MemberList groupId={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
