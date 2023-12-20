import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Post from "../../components/Post";

test("test should Post match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <Post postId={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
