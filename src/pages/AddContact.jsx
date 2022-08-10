import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const AddContact = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // get form values
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    setError("");

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // list of rules for form validation
    const ADD_CONTACT_RULES = [
      {
        condition: email !== "",
        error: "Please fill all the required fields",
      },
      {
        condition: regexEmail.test(email),
        error: "Invalid email address",
      },
    ];

    let ruleBroken = false;
    // check whether rule conditions are passed
    ADD_CONTACT_RULES.forEach((rule) => {
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
      setLoadingText("Adding Contact...");
      const result = await axiosPrivate.post("/contacts/add", {
        name,
        email,
      });
      const resData = result.data;
      // show error if custom error field found
      if (resData.error) {
        setError(resData.error);
        return;
      }
      setMessage(`New Contact ${resData.contactName} added`);
      // add contact id to contacts context if contacts is stored in memory
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
    } finally {
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Contact
          </Typography>
          <Typography
            component={"h5"}
            variant="body2"
            color={"red"}
            borderBottom={"1px solid red"}
          >
            {error}
          </Typography>
          <Typography
            component={"h5"}
            variant="body2"
            color={"green"}
            borderBottom={"1px solid green"}
          >
            {message}
          </Typography>
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
              name="name"
              label="Name"
              type="text"
              id="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Contact
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        {isLoading && <Loading text={loadingText} />}
      </Container>
    </ThemeProvider>
  );
};

export default AddContact;
