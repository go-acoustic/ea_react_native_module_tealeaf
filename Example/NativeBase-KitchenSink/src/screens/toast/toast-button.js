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

const ToastButton = () => {
  
  return (
    <Container style={styles.container}>
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Toast Button Style</Title>
        </Body>
        <Right />
      </Header>

      <Content 
          scrollEnabled={false}
          contentContainerStyle={{width: '100%'}}
          padder>
        <Button
          onPress={() => {
            Toast.show({
              text: "Wrong password!",
              buttonText: "Okay",
              buttonTextStyle: { color: "#008000" },
              buttonStyle: { backgroundColor: "#5cb85c" },
              onClose: () => {
                TLTRN.logScreenLayout("Wrong password!");
              }
            })
          }}
        >
          <Text>Toast</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default ToastButton;
