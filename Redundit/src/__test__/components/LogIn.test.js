import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import LogIn from "../../components/LogIn";

test("test should LogIn match snapshot", async () => {
  const tree = renderer.create(
    <LogIn />,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
