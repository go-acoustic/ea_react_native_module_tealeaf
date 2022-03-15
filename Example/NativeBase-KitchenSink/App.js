import { Root } from "native-base";
import React from "react";
import Setup from "./src/boot/setup";

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <Setup />
      </Root>
    );
  }
}
