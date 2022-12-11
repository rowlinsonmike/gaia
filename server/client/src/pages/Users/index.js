import React from "react";
import { Button, Stack, IconButton, Icon, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "components/Modal";
import NewUser from "./NewUser";
import { fetcher } from "auth";
export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [edit, setEdit] = React.useState(false);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);
  const fetchUsers = () => {
    fetcher("/api/users").then(({ users }) => setUsers(users));
  };
  const deleteUser = (id) => () => {
    fetcher(`/api/users/${id}`, { method: "delete" }).then(({ error }) => {
      if (error) return;
      fetchUsers();
    });
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <Stack alignItems="start" spacing={2}>
      <Typography variant="h4" mb={2}>
        Users
      </Typography>
      <Modal
        {...{
          width: 500,
          forceOpen: edit,
          onClose: () => {
            closeEdit();
            fetchUsers();
          },
        }}
      >
        {({ handleClose }) => <NewUser close={handleClose} />}
      </Modal>
      <Stack direction="row" spacing={2}>
        <Button onClick={openEdit} variant="contained" color="secondary">
          Add User
        </Button>
        <Button onClick={fetchUsers} variant="contained">
          Refresh
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>First</TableCell>
              <TableCell>Last</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.pk}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell>{user.first}</TableCell>
                <TableCell>{user.last}</TableCell>
                <TableCell>{user.created_by}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={deleteUser(user.pk)} color="error">
                    <Icon color="error">clear</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
