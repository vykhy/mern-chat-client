import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const secondary = true;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await axiosPrivate.get("/contacts");
      console.log(response.data.contacts);
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
              <MenuItem key={idx}>
                <ListItemAvatar>
                  <Avatar src={contact.img || "/images/default-user.png"} />
                </ListItemAvatar>
                <ListItemText
                  cursor={"pointer"}
                  primary={contact.name}
                  secondary={secondary ? contact.contactId.email : null}
                />
                <Divider />
              </MenuItem>
            ))}
        </MenuList>
      </Grid>
    </Box>
  );
};
export default Contacts;
