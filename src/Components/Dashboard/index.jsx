import React from "react";
import Container from "@material-ui/core/Container";
import MyPlaylists from "../MyPlaylists";

const Dashboard = props => {
  return (
    <Container>
      <MyPlaylists />
    </Container>
  );
};

export default Dashboard;
