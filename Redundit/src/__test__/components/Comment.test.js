import { render, screen, waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import Comment from "../../components/Comment";

const testComment = {
  iduser: 1,
  idpost: 1,
  content: "this is a new comment",
  status: false,
  flagged: false,
  image: "https://source.unsplash.com/random",
  audio: "https://source.unsplash.com/random",
  video: "https://source.unsplash.com/random",
};

test("test should render Comment component", () => {
  render(
    <BrowserRouter>
      <Comment comment={testComment} iduser={1} idpost={1} />
    </BrowserRouter>,
  );
  const title = screen.getByText("this is a new comment");
  expect(title).toBeInTheDocument();
});

test("test should CommentList match snapshot", () => {
  const tree = renderer.create(
    <BrowserRouter>
      <Comment comment={testComment} iduser={1} idpost={1} />
    </BrowserRouter>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
