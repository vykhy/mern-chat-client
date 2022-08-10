import { Backdrop, CircularProgress, Typography } from "@mui/material";

function Loading({ text = "" }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
      <br />
      <Typography variant={"h6"}>{text}</Typography>
    </Backdrop>
  );
}

export default Loading;
