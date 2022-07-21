import React from "react";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <Grid container marginBottom={"20px"}>
        <Grid item xs={4}>
          <Link to="/">Chats</Link>
        </Grid>
        <Grid item xs={4}>
          <Link to="/contacts">Contacts</Link>
        </Grid>
        <Grid xs={4}></Grid>
      </Grid>
    </>
  );
}

export default Header;
