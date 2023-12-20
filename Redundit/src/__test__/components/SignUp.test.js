import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import SignUp from "../../components/SignUp";

test("test should SignUp match snapshot", async () => {
  const tree = renderer.create(
    <SignUp />,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
