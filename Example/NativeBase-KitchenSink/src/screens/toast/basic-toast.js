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

class BasicToast extends Component {
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
            <Title>Basic Toast</Title>
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
                onClose: () => {
                  TLTRN.logScreenLayout("Wrong password!");
                }
              })}
          >
            <Text>Toast</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default BasicToast;
