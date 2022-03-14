import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  List,
  ListItem
} from "native-base";
import styles from "./styles";

const datas = [
  {
    route: "BasicListSwipe",
    text: "Single SwipeRow"
  },
  {
    route: "SwipeRowCustomStyle",
    text: "Swipe Row Custom Style"
  },
  {
    route: "MultiListSwipe",
    text: "Multiple List Swipe"
  }
];

class ListSwipe extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>List Swipe</Title>
          </Body>
          <Right />
        </Header>

        <Content 
          horizontal
          scrollEnabled={false}
          contentContainerStyle={{width: '100%'}}>
          <List
            dataArray={datas}
            keyExtractor={(item, index) => String(index)}
            renderRow={data =>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Text>
                    {data.text}
                  </Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default ListSwipe;
