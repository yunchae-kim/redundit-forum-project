import { render, screen, waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import ChatList from "../../components/ChatList";

const mockAxios = new MockAdapter(axios);
mockAxios.onGet().reply(200, {
  data: [
    {
      idchat: 1,
      iduser: 1,
      name: "One",
      timestamp: {},
      private: true,
    },
    {
      idchat: 2,
      iduser: 1,
      name: "Two",
      timestamp: {},
      private: true,
    },
    {
      idchat: 3,
      iduser: 1,
      name: "Three",
      timestamp: {},
      private: true,
    }],
});

test("test should render ChatList component", async () => {
  render(<ChatList userId={1} />);
  await waitFor(() => {
    const label = screen.getByText(/ChatList/i);
    expect(label).toBeInTheDocument();
  });
});

test("test should ChatList match snapshot", () => {
  const tree = renderer.create(
    <BrowserRouter>
      <ChatList userId={1} />
    </BrowserRouter>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
