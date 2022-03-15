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

class ToastPosition extends Component {
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
            <Title>Toast Position</Title>
          </Body>
          <Right />
        </Header>

        <Content 
          scrollEnabled={false}
          contentContainerStyle={{width: '100%'}}
          padder>
          <Button
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                position: "top",
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Top Toast</Text>
          </Button>
          <Button
            style={styles.mb15}
            onPress={() =>
              Toast.show({
                text: "Wrong password!",
                buttonText: "Okay",
                position: "bottom",
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Bottom Toast</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default ToastPosition;
