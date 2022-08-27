import { useState } from "react";
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
import Loading from "../components/Loading";
import axios from "axios";

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
        MERN Chat
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Signup = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState();
  const [message, setMessage] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    setError("");
    setMessage("");

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const SIGNUP_RULES = [
      {
        condition:
          firstName !== "" &&
          lastName !== "" &&
          email !== "" &&
          password !== "",
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
      {
        condition: password === confirmPassword,
        error: "Passwords do not match",
      },
    ];

    let ruleBroken = false;
    SIGNUP_RULES.forEach((rule) => {
      if (ruleBroken === true) return;
      if (rule.condition === false) {
        setError(rule.error);
        ruleBroken = true;
      }
    });
    if (ruleBroken) return;

    setLoadingText("Signing up...");
    setIsLoading(true);
    try {
      const result = await axios.post(
        process.env.REACT_APP_DEV_SERVER_URL + "/auth/signup",
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }
      );
      const resData = result.data;
      if (resData.error) {
        setError(resData.error);
        return;
      }
      setMessage(resData.message);
    } catch (err) {
      setError(err.message);
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Typography
            component={"h5"}
            variant="body2"
            color={"red"}
            borderBottom={"1px solid red"}
          >
            {error}
          </Typography>
          {message && (
            <Typography
              component={"h5"}
              variant="body2"
              color={"green"}
              border={"1px solid green"}
              borderRadius={"3px"}
              padding={"5px"}
            >
              {message}
            </Typography>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        {isLoading && <Loading text={loadingText} />}
      </Container>
    </ThemeProvider>
  );
};
export default Signup;
