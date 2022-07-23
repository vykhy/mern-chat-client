import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuthContext } from "../contexts/authContext";

function Message({ message }) {
  const {
    user: { id },
  } = useAuthContext();
  const backGroundColor = id === message.authorId ? "blue" : "gray";
  const color = id === message.authorId ? "white" : "black";
  const alignSelf = id === message.authorId ? "end" : "start";
  return (
    <Box
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        marginBottom: "10px",
        width: "fit-content",
        maxWidth: "80%",
        backgroundColor: backGroundColor,
        color: color,
        alignSelf: alignSelf,
      }}
    >
      {/* <Card variant="outlined">{card}</Card> */}
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {message.createdAt}
        </Typography>
        {/* <Typography variant="h5" component="div">
            
          </Typography> */}
        <Typography variant="body2">{message.message}</Typography>
        <br />
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          {message.read
            ? "Read"
            : !message.read && message.delivered
            ? "Delivered"
            : "Sent"}
        </Typography>
      </CardContent>
      {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
    </Box>
  );
}

export default Message;
