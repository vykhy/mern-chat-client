import React, { useState } from "react";
import { AddPhotoAlternate, Delete, FileUpload } from "@mui/icons-material";
import {
  Avatar,
  List,
  ListItem,
  Grid,
  Box,
  Divider,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useAuthContext } from "../contexts/authContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

function EditProfileImage({ img }) {
  const [currentImage, setCurrentImage] = useState(img);
  const [newImage, setNewImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { user, setNewUser } = useAuthContext();

  // Delete modal state
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", newImage);
    try {
      const response = await axiosPrivate.post(
        process.env.REACT_APP_DEV_SERVER_URL + "/users/profile-image",
        formData
      );
      setNewUser(response.data);
      setSuccess(true);
      //console.log(response.data);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files.length < 1) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setError("Invalid file. Please choose an image");
      return;
    }
    setNewImage(file);
    setCurrentImage(URL.createObjectURL(file));
  };
  const removeProfilePicture = async () => {
    try {
      const response = await axiosPrivate.delete(
        process.env.REACT_APP_DEV_SERVER_URL + "/users/profile-image"
      );
      const removed = response.data.removed;
      if (removed) {
        setNewUser({
          id: user.id,
          name: user.name,
          thumbnail: null,
          profilePicture: null,
        });
        setSuccess(true);
        setCurrentImage(null);
        handleClose();
      }
    } catch (err) {
      setError("There was an error");
    }
  };
  return (
    <Grid
      container
      display={"flex"}
      justifyContent={"center"}
      style={{ backgroundColor: "rgb(230,230,230)" }}
    >
      <Grid item xs={12} md={8} lg={6} style={{ backgroundColor: "white" }}>
        {success && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Profile picture updated!
          </Alert>
        )}
        {error && (
          <Alert severity="error">
            <AlertTitle>Failed</AlertTitle>
            {error}
          </Alert>
        )}
        <Box
          fullWidth
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "gray",
            borderRadius: "10px",
            maxWidth: "100%",
            height: "500px",
          }}
        >
          <img
            src={currentImage || "/images/default-user.png"}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contained",
            }}
          />
        </Box>
        <List>
          <form encType="multipart">
            <ListItem>
              <Avatar
                style={{ marginRight: "5px", backgroundColor: "#1769aa" }}
              >
                <AddPhotoAlternate />
              </Avatar>
              <Button variant="contained" component="label" color="primary">
                {" "}
                Select new image
                <input type="file" hidden onChange={handleFileSelect} />
              </Button>
              {/* <Avatar style={{ marginRight: '5px'}}>
              <Camera />
            </Avatar>             */}
            </ListItem>
            <Divider component="li" />
            {newImage && (
              <ListItem>
                <Avatar
                  style={{ marginRight: "5px", backgroundColor: "#1769aa" }}
                >
                  <FileUpload />
                </Avatar>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {" "}
                  Upload selected image
                </Button>
              </ListItem>
            )}
          </form>
          {newImage && <Divider component="li" />}
          <ListItem>
            <Avatar style={{ marginRight: "5px", backgroundColor: "#e53935" }}>
              <Delete />
            </Avatar>
            <Button
              variant="contained"
              component="button"
              style={{ backgroundColor: "#e53935" }}
              onClick={handleOpen}
            >
              Remove Profile Picture
            </Button>
          </ListItem>
        </List>
      </Grid>
      {/* Delete modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Are you sure you want to remove your profile picture?
            </Typography>
            <Button
              variant="contained"
              component="button"
              style={{ backgroundColor: "#e53935", marginTop: "15px" }}
              onClick={removeProfilePicture}
            >
              Remove
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Grid>
  );
}

export default EditProfileImage;
