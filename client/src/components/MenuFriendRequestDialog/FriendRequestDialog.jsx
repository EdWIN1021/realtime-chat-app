import React, { useState, useEffect } from "react";
import { fireStore } from "../../firebase/config";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";

import NotificationsIcon from "@material-ui/icons/Notifications";
import RequestItem from "../RequestItem/RequestItem";

const FriendRequestDialog = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const [numOfReq, setNumOfReq] = useState(null);
  const [requestList, setRequestList] = useState(null);

  useEffect(() => {
    let temp = [];
    fireStore
      .collection("requests")
      .doc("users")
      .collection(currentUser.uid)
      .get()
      .then((snapshot) => {
        setNumOfReq(snapshot.size);
        snapshot.docs.map((doc) => temp.push(doc.data()));
        setRequestList(temp);
        temp = null;
      });
  }, []);

  // useEffect(() => {
  //   fireStore
  //     .collection("users")
  //     .doc(currentUser.uid)
  //     .collection("requests")
  //     .onSnapshot((snapshot) => setNumOfReq(snapshot.size));
  // }, []);

  if (requestList) {
    return (
      <>
        <IconButton color="inherit" onClick={() => setOpen(true)}>
          <Badge badgeContent={numOfReq} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          {numOfReq === 0 ? (
            <DialogTitle id="alert-dialog-title">
              You have no request
            </DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">Requests</DialogTitle>
          )}

          <DialogContent>
            <List>
              {requestList.map((requestUser) => (
                <RequestItem
                  key={requestUser.uid}
                  currentUser={currentUser}
                  requestUser={requestUser}
                />
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return null;
  }
};

export default FriendRequestDialog;
