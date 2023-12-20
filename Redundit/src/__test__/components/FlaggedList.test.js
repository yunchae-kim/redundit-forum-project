import { render, screen, act } from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import FlaggedList from "../../components/FlaggedList";

test("test should render FlaggedList component", () => {
  // render(
  //   <BrowserRouter>
  //     <FlaggedList />
  //   </BrowserRouter>,
  // );
  // const title = screen.getAllByText(/This is a test. Test. Test. Longer. Longer./i)[0];
  // expect(title).toBeInTheDocument();
});

test("test should FlaggedList match snapshot", () => {
  const tree = renderer.create(
    <BrowserRouter>
      <FlaggedList />
    </BrowserRouter>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
