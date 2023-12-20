import { render, screen, waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";

import EditComment from "../../components/EditComment";

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

const testHashTags = [{ hashtag: "tag1" }, { hashtag: "tag2" }];

const testProps = { state: { comment: testComment, hashtags: testHashTags } };

test("test should render EditComment component", async () => {
  render(
    <EditComment location={testProps} />,
  );
  const tag = screen.getByText("tag2");
  await waitFor(() => {
    expect(tag).toBeInTheDocument();
  });
});

test("test should EditComment match snapshot", () => {
  const tree = renderer.create(
    <EditComment location={testProps} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
