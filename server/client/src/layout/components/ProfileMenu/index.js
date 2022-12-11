import React from "react";
import useAuthentication, { logout } from "auth";
import { Button, Box, Divider, Typography, Stack, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Menu from "components/Menu";
import Modal from "components/Modal";
import ResetPassword from "layout/components/ResetPassword";
export default function AccountPopover() {
  const [edit, setEdit] = React.useState(false);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  const user = useAuthentication();
  const navigate = useNavigate();
  const logoutHandler = () => {
    logout();
  };
  return (
    <>
      <Modal
        {...{
          width: 500,
          forceOpen: edit,
          onClose: () => {
            closeEdit();
          },
        }}
      >
        {({ handleClose }) => <ResetPassword close={handleClose} />}
      </Modal>
      <Menu icon="person">
        {() => (
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Stack alignItems="center" spacing={3} direction="row">
                <Avatar>{user?.id[0]?.toUpperCase()}</Avatar>
                <Stack>
                  <Typography variant="subtitle1" noWrap>
                    {`${user?.first} ${user?.last}`}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Stack spacing={2} sx={{ p: 2, pt: 1.5 }}>
              <Button
                onClick={openEdit}
                fullWidth
                color="inherit"
                variant="outlined"
              >
                Reset Password
              </Button>
              <Button
                onClick={logoutHandler}
                fullWidth
                color="inherit"
                variant="outlined"
              >
                Logout
              </Button>
            </Stack>
          </>
        )}
      </Menu>
    </>
  );
}
