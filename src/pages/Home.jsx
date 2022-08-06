import React from "react";
import Grid from "@mui/material/Grid";
import Chats from "../components/Chats";

const Home = ({ chats }) => {
  return (
    <div>
      <Grid container>
        <Grid item padding={"10px"} xs={12} md={4}>
          <Chats chats={chats}></Chats>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
