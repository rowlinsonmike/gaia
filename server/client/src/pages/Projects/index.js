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
import NewProject from "pages/Projects/NewProject";
import { useNavigate } from "react-router-dom";
import { fetcher } from "auth";
export default function Projects() {
  const [edit, setEdit] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const navigate = useNavigate();
  const goToProject = (id) => () => navigate(id);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);
  const fetchProjects = () => {
    fetcher("/api/project").then(({ projects }) => setProjects(projects || []));
  };
  React.useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <Stack alignItems="start" spacing={2}>
      <Typography variant="h4" mb={2}>
        Projects
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button onClick={openEdit} variant="contained" color="secondary">
          Add Project
        </Button>
        <Button onClick={fetchProjects} variant="contained">
          Refresh
        </Button>
      </Stack>
      <Modal
        {...{
          width: 500,
          forceOpen: edit,
          onClose: () => {
            closeEdit();
            fetchProjects();
          },
        }}
      >
        {({ handleClose }) => <NewProject close={handleClose} />}
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Repo</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((row) => (
              <TableRow
                key={row.pk}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.repo}
                </TableCell>
                <TableCell>{row?.path || "root"}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.created_by}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={goToProject(row.pk)}>
                    <Icon>arrow_forward</Icon>
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
