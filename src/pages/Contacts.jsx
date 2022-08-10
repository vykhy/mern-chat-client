import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "../components/Contact";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";
import { Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Contacts = ({ chats, dispatch }) => {
  const [contacts, setContacts] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const goTo = (url) => {
    navigate(url);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await axiosPrivate.get(
        process.env.REACT_APP_DEV_SERVER_URL + "/contacts"
      );
      setContacts(response.data.contacts);
    };
    fetchContacts();
  }, []);
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Grid container spacing={2} style={{ marginTop: "1px" }}>
        <Grid item xs={0} md={3}></Grid>
        <Grid item xs={12} md={5}>
          <Typography variant={"h6"} gutterBottom>
            Your Contacts
          </Typography>
          <MenuList
            style={{
              paddingBottom: 0,
            }}
          >
            {contacts
              ?.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
              .map((contact, idx) => (
                <Contact
                  key={idx}
                  contact={contact}
                  chats={chats}
                  dispatch={dispatch}
                  goTo={goTo}
                />
              ))}
          </MenuList>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Contacts;
