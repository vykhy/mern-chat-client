import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAuthContext } from "../contexts/authContext";
import { format } from "fecha";

const Message = ({ message, handlePopUp }) => {
  const {
    user: { id },
  } = useAuthContext();
  const backGroundColor = id === message.authorId ? "#1662da" : "white";
  const color = id === message.authorId ? "white" : "black";
  const alignSelf = id === message.authorId ? "end" : "start";

  return (
    <Box
      style={{
        borderRadius: "5px",
        marginBottom: "10px",
        width: "fit-content",
        maxWidth: "80%",
        backgroundColor: backGroundColor,
        color: color,
        fontWeight: "bold",
        boxShadow: "0px 11px 32px -12px rgba(102,102,102,1)",
        alignSelf: alignSelf,
      }}
      onClick={(e) => handlePopUp(e, message)}
    >
      {/* <Card variant="outlined">{card}</Card> */}
      <CardContent style={{ paddingBottom: "0px" }}>
        <Typography color="#a0a0a0" variant="body2" gutterBottom>
          {format(new Date(message.createdAt), "HH:mm, ddd MMM Do, YY ")}
        </Typography>
        {/* <Typography variant="h5" component="div">
            
          </Typography> */}
        <Typography style={{ paddingBottom: "0px" }}>
          {message.message}
        </Typography>
        <br />
        {id === message.authorId && (
          <Typography variant="body2" sx={{ mb: 0.5 }} color="#a0a0a0">
            {message.read
              ? "Read"
              : !message.read && message.delivered
              ? "Delivered"
              : "Sent"}
          </Typography>
        )}
      </CardContent>
      {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
    </Box>
  );
};

export default Message;
