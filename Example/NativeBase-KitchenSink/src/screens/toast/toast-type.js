import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Toast
} from "native-base";
import styles from "./styles";
import { TLTRN } from "react-native-acoustic-ea-tealeaf";

class ToastType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false
    };
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Toast Type</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Button
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Default Toast</Text>
          </Button>
          <Button
            success
            style={styles.mb15}
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                type: "success",
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Success Toast</Text>
          </Button>
          <Button
            warning
            style={styles.mb15}
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                type: "warning",
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Warning Toast</Text>
          </Button>
          <Button
            danger
            style={styles.mb15}
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                type: "danger",
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Danger Toast</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default ToastType;
