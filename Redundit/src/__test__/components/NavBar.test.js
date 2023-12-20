import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import NavBar from "../../components/NavBar";

test("test should NavBar match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
