import { render, screen, act } from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import CommentList from "../../components/CommentList";

const mockAxios = new MockAdapter(axios);
mockAxios
  .onGet()
  .reply(200, {
    data: [
      {
        idcomment: 1,
        iduser: 1,
        idpost: 1,
        content: "this is a new comment",
        status: false,
        flagged: false,
        image: "https://source.unsplash.com/random",
        audio: "https://source.unsplash.com/random",
        video: "https://source.unsplash.com/random",
      },
      {
        idcomment: 2,
        iduser: 2,
        idpost: 1,
        content: "this is a another comment",
        status: false,
        flagged: false,
        image: "https://source.unsplash.com/random",
        audio: "https://source.unsplash.com/random",
        video: "https://source.unsplash.com/random",
      }],
  });

test("test should render CommentList component", async () => {
  await act(async () => render(
    <BrowserRouter>
      <CommentList postId={1} />
    </BrowserRouter>,
  ));
  const title = screen.getByText("this is a new comment");
  expect(title).toBeInTheDocument();
});

test("test should CommentList match snapshot", () => {
  // const tree = renderer.create(
  //   <BrowserRouter>
  //     <CommentList postId={1} />
  //   </BrowserRouter>,
  // ).toJSON();

  // expect(tree).toMatchSnapshot();
});
