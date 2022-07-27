import { Camera, Delete } from "@mui/icons-material";
import {
  Avatar,
  MenuList,
  MenuItem,
  Grid,
  Box,
  Divider,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useAuthContext } from "../contexts/authContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function EditProfileImage({ img }) {
  const [currentImage, setCurrentImage] = useState(img);
  const [newImage, setNewImage] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { setNewUser } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", newImage);
    try {
      const response = await axiosPrivate.post(
        "/users/profile-image",
        formData
      );
      setNewUser(response.data);
      //console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files.length < 1) return;
    setNewImage(e.target.files[0]);
    setCurrentImage(URL.createObjectURL(e.target.files[0]));
  };
  return (
    <Grid
      container
      display={"flex"}
      justifyContent={"center"}
      style={{ backgroundColor: "rgb(230,230,230)" }}
    >
      <Grid item xs={12} md={8} lg={6} style={{ backgroundColor: "white" }}>
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
        <MenuList>
          <form encType="multipart">
            <MenuItem>
              <Button variant="contained" component="label" color="primary">
                {" "}
                Select new image
                <input type="file" hidden onChange={handleFileSelect} />
              </Button>
              {/* <Avatar style={{ marginRight: '5px'}}>
              <Camera />
            </Avatar>             */}
            </MenuItem>
            <Divider component="li" />
            {newImage && (
              <MenuItem>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {" "}
                  Upload selected image
                </Button>
              </MenuItem>
            )}
          </form>
          {newImage && <Divider component="li" />}
          <MenuItem>
            <Avatar style={{ marginRight: "5px" }}>
              <Delete />
            </Avatar>
            Remove Profile Picture
          </MenuItem>
        </MenuList>
      </Grid>
    </Grid>
  );
}

export default EditProfileImage;
