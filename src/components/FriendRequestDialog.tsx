import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RequestItem from "./RequestItem";
import { db, getRequestUserInfo, getUserProfile } from "../lib/firebase";
import { Profile } from "../types";
import { AuthContext } from "../contexts/AuthContext";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";

const FriendRequestDialog = () => {
  const [open, setOpen] = useState(false);
  const [requestList, setRequestList] = useState<Profile[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    (async () => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, "users", user?.uid), async () => {
          const profile = (await getUserProfile(user?.uid)) as Profile;
          profile?.requests?.length > 0
            ? setRequestList(await getRequestUserInfo(profile?.requests))
            : setRequestList([]);
        });
      }
    })();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge badgeContent={requestList?.length} color="secondary">
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
        <DialogTitle id="alert-dialog-title">
          {requestList.length > 0 ? "Requests" : "You have no request"}
        </DialogTitle>

        <DialogContent>
          <List>
            {requestList.map((requestedUser) => (
              <RequestItem
                key={requestedUser.userId}
                user={user}
                requestedUser={requestedUser}
              />
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FriendRequestDialog;
