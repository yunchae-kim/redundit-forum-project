import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import ProfileView from "../../components/ProfileView";

test("test should ProfileView match snapshot", async () => {
  const tree = renderer.create(
    <ProfileView />,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
