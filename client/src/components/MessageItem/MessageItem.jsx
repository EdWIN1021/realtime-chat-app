import React from "react";
import "./message.item.styles.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/reducer/selectors";
import { Box, Avatar } from "@material-ui/core";
const MessageItem = ({ item }) => {
  const currentUser = useSelector(selectUser);
  if (currentUser.uid === item.sender) {
    return (
      <Box className="message-right" mb={1}>
        <Box className="message-right-content" boxShadow={1}>
          {item.message}
        </Box>
        <Box className="message-name">
          <Avatar alt={item.name} src="..." />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box className="message-left" mb={1}>
        <Box className="message-name">
          <Avatar alt={item.name} src="..." />
        </Box>
        <Box className="message-left-content" boxShadow={1}>
          {item.message}
        </Box>
      </Box>
    );
  }
};

export default MessageItem;