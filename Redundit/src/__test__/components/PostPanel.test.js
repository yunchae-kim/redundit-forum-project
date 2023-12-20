import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import PostPanel from "../../components/PostPanel";

test("test should PostPanel match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <PostPanel postId={1} userId={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
