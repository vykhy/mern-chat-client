import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Chats from "../components/Chats";

const Home = ({ chats }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth > 768) {
      navigate(`/chats`);
    }
  }, []);

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
