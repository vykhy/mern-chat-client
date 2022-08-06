import { useState, useEffect } from "react";
import Contact from "../components/Contact";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Contacts = ({ chats, dispatch }) => {
  const [contacts, setContacts] = useState([]);
  const axiosPrivate = useAxiosPrivate();

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
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Grid container spacing={2}>
        <MenuList>
          {contacts
            ?.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
            .map((contact, idx) => (
              <Contact
                key={idx}
                contact={contact}
                chats={chats}
                dispatch={dispatch}
              />
            ))}
        </MenuList>
      </Grid>
    </Box>
  );
};
export default Contacts;
