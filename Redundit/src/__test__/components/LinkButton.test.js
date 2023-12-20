import {
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import LinkButton from "../../components/LinkButton";

test("test should LinkButton match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <LinkButton url="test" text="123" groupId={1} />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
