import { useState } from "react";
import axios from "../api/axios";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAuthContext } from "../contexts/authContext";
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

const Login = () => {
  const [error, setError] = useState("");
  const { user, setNewUser, updateTokens } = useAuthContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // get form values
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    setError("");

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // list of rules for form validation
    const LOGIN_RULES = [
      {
        condition: email !== "" && password !== "",
        error: "Please fill all the required fields",
      },
      {
        condition: regexEmail.test(email),
        error: "Invalid email address",
      },
      {
        condition: password.length >= 5,
        error: "Password must contain at least 5 characters",
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
      const result = await axios.post("/auth/login", {
        email,
        password,
      });
      const resData = result.data;
      // show error if custom error field found
      if (resData.error) {
        setError(resData.error);
      }
      // update context with user data
      const { userId, userName, accessToken } = resData;
      setNewUser({
        id: userId,
        name: userName,
      });
      updateTokens(accessToken);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
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
            Sign in
          </Typography>
          <Typography
            component={"h5"}
            variant="body2"
            color={"red"}
            borderBottom={"1px solid red"}
          >
            {error}
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="/" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
