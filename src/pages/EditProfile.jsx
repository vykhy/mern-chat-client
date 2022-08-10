import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { Alert, AlertTitle } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AccountBox } from "@mui/icons-material";

import { useAuthContext } from "../contexts/authContext";
import Loading from "../components/Loading";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        MERN chat
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const EditProfile = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState();
  const { user, setNewUser } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await axiosPrivate.get(
        process.env.REACT_APP_DEV_SERVER_URL + `/users/${user.id}`
      );
      const details = response.data;
      setFirstName(details.firstName);
      setLastName(details.lastName);
      setAbout(details.about);
    };
    fetchUserDetails();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // get form values
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("about", about);
    setError("");

    // list of rules for form validation
    const LOGIN_RULES = [
      {
        condition: firstName !== "",
        error: "First name cannot be empty",
      },
      {
        condition: lastName !== "",
        error: "Last name cannot be empty",
      },
      {
        condition: firstName.length + lastName.length < 25,
        error: "Name cannot have more than 25 characters",
      },
      {
        condition: about.length < 100,
        error: "About cannot have more than 100 characters",
      },
    ];

    let ruleBroken = false;
    // check whether rule conditions are passed
    LOGIN_RULES.forEach((rule) => {
      if (ruleBroken === true) return;
      if (rule.condition === false) {
        setError(rule.error);
        ruleBroken = true;
      }
    });
    // return if all rules not passed
    if (ruleBroken) return;
    // post to server
    try {
      setIsLoading(true);
      setLoadingText("Updating Profile...");
      const result = await axiosPrivate.put(
        process.env.REACT_APP_DEV_SERVER_URL + "/users/profile",
        {
          firstName,
          lastName,
          about,
        }
      );
      const resData = result.data;
      // show error if custom error field found
      if (resData.error) {
        setError(resData.error);
        return;
      }
      // update context with user data
      const { _id, thumbnail, profilePicture } = resData;
      const fName = resData.firstName;
      const lName = resData.lastName;
      setNewUser({
        id: _id,
        name: `${fName} ${lName}`,
        thumbnail,
        profilePicture,
      });
      setSuccess("Profile updated!");
    } catch (err) {
      console.log(err.message);
      setError("There was an error");
    } finally {
      setLoadingText("");
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AccountBox />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          {success && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error">
              <AlertTitle>Failed</AlertTitle>
              {error}
            </Alert>
          )}
          <Typography
            component={"h5"}
            variant="body2"
            color={"red"}
            borderBottom={"1px solid red"}
          ></Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="First name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="last-name"
              label="Last"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="about"
              label="About"
              id="about"
              autoComplete="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update profile
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        {isLoading && <Loading text={loadingText} />}
      </Container>
    </ThemeProvider>
  );
};

export default EditProfile;
