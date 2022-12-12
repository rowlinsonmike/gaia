import React from "react";
import {
  Button,
  Stack,
  IconButton,
  Icon,
  Typography,
  Badge,
  Paper,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import yaml from "json-to-pretty-yaml";
import Modal from "components/Modal";
import Approve from "pages/Job/Approve";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useParams } from "react-router-dom";
import { fetcher } from "auth";
import toast from "react-hot-toast";
const SEVS = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "info",
  INFO: "success",
  TRACE: "success",
};
const CLOUDS = {
  AWS: "#FF9900",
};
export default function Job() {
  const { id, job } = useParams();
  const [data, setData] = React.useState({});
  const [project, setProject] = React.useState({});
  const [edit, setEdit] = React.useState(false);
  const graphDataEl = React.createRef(null);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);
  const navigate = useNavigate();
  const fetchJob = () => {
    fetcher(`/api/job?id=${job}`).then((data) => setData(data || {}));
  };
  const fetchProject = () => {
    fetcher(`/api/project/${id}`).then((data) => setProject(data || {}));
  };
  const selectAllGraphData = () => {
    if (!graphDataEl?.current) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(graphDataEl.current);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  const refresh = () => {
    fetchJob();
    fetchProject();
  };
  React.useEffect(() => {
    refresh();
  }, []);
  const rescan = () => {
    fetcher(`/api/rescan/${id}/${job}`, {
      method: "post",
    }).then(({ error }) => {
      if (error) toast.error(error);
      toast.success("started rescan");
    });
  };
  const deleteJob = () => {
    fetcher(`/api/job?id=${job}`, { method: "delete" }).then(({ error }) => {
      if (error) return;
      navigate(`/projects/${id}`);
    });
  };
  return (
    <Stack alignItems="start" spacing={2}>
      <Modal
        {...{
          width: 500,
          forceOpen: edit,
          onClose: () => {
            closeEdit();
            refresh();
          },
        }}
      >
        {({ handleClose }) => <Approve close={handleClose} id={job} />}
      </Modal>
      <Typography variant="h4" gutterBottom>
        {data?.name} ({data?.status})
      </Typography>
      <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
        <Button
          disabled={data?.apply || !data?.plan}
          onClick={openEdit}
          variant="contained"
          color="secondary"
        >
          Approve Apply
        </Button>
        <Button
          disabled={data?.apply || !data.plan}
          onClick={rescan}
          variant="contained"
        >
          Rescan
        </Button>
        <Button onClick={refresh} variant="contained">
          Refresh
        </Button>
        <IconButton
          onClick={deleteJob}
          color="error"
          sx={{ marginLeft: "auto !important" }}
        >
          <Icon color="error">clear</Icon>
        </IconButton>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Repo</TableCell>
              <TableCell>Project Path</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Applied By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{project?.project?.name}</TableCell>
              <TableCell>{project?.project?.repo}</TableCell>
              <TableCell>{project?.project?.path || "root"}</TableCell>
              <TableCell>{data?.created_by}</TableCell>
              <TableCell>{data?.applied_by || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Accordion sx={{ width: "100%", maxWidth: "85vw !important" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Icon color="warning">lightbulb_circle</Icon>
            <Typography color="text.secondary" gutterBottom>
              Linting
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {!data?.tflint?.issues?.length
            ? "-"
            : data?.tflint?.issues?.map((i) => {
                return (
                  <Accordion key={i?.query_id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon color="secondary" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Icon color="warning">code</Icon>
                        <Typography>{i?.message}</Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <pre>{yaml.stringify(i)}</pre>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%", maxWidth: "85vw !important" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Icon color="error">policy</Icon>
            <Typography color="text.secondary" gutterBottom>
              Static Code Analysis
            </Typography>
            <Stack
              sx={{
                marginLeft: "auto !important",
                paddingTop: 3,
                paddingRight: 5,
                paddingBottom: 3,
              }}
              direction="row"
              spacing={2}
            >
              <Badge
                badgeContent={data?.kics?.severity_counters?.HIGH || 0}
                color="error"
              >
                <Icon color="error">flag_circle</Icon>
              </Badge>
              <Badge
                badgeContent={data?.kics?.severity_counters?.MEDIUM || 0}
                color="warning"
              >
                <Icon color="warning">flag_circle</Icon>
              </Badge>
              <Badge
                badgeContent={data?.kics?.severity_counters?.LOW || 0}
                color="info"
              >
                <Icon color="info">flag_circle</Icon>
              </Badge>
              <Badge
                badgeContent={
                  data?.kics?.severity_counters?.INFO +
                    data?.kics?.severity_counters?.TRACE || 0
                }
                color="success"
              >
                <Icon color="success">flag_circle</Icon>
              </Badge>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {!data?.kics?.queries
            ? "-"
            : data?.kics?.queries?.map((i) => {
                return (
                  <Accordion key={i?.query_id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon color="secondary" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Icon color={SEVS[i?.severity]}>flag_circle</Icon>
                        <Icon sx={{ color: CLOUDS[i?.cloud_provider] }}>
                          cloud
                        </Icon>
                        <Typography>
                          {i?.query_name} ({i?.category})
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{i?.description}</Typography>
                      <br />
                      {i?.files.map((f) => {
                        return <pre>{yaml.stringify(f)}</pre>;
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%", maxWidth: "85vw !important" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon color="info">explore</Icon>
            <Typography color="text.secondary" gutterBottom>
              Plan
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ whiteSpace: "pre-line" }}
            variant="body1"
            component="p"
          >
            {data?.plan || "-"}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%", maxWidth: "85vw !important" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon color="warning">account_tree</Icon>
            <Typography color="text.secondary" gutterBottom>
              Graph Data
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => {
              selectAllGraphData();
              toast.success("Graph data selected. You can now copy it.");
            }}
            sx={{ position: "absolute", top: "10px", right: "50px" }}
            color="secondary"
          >
            <Icon color="secondary">select_all</Icon>
          </IconButton>
          <IconButton
            onClick={() => {
              try {
                navigator.clipboard.writeText(data?.graph);
                toast.custom(
                  <div>
                    Graph data copied to clipboard! Open{" "}
                    <a
                      style={{ color: "#75D701" }}
                      target="_blank"
                      href="https://app.diagrams.net/"
                    >
                      drawio
                    </a>{" "}
                    and paste the csv data in via{" "}
                    <strong>{"Arrange > Insert > Advanced > CSV"}</strong>
                  </div>,
                  {
                    duration: 6000,
                  }
                );
              } catch (e) {
                toast.error(
                  "Enable copy by running GAIA behind HTTPS or overriding your browser's security. You can also manually copy the graph data."
                );
              }
            }}
            sx={{ position: "absolute", top: "10px", right: "10px" }}
            color="secondary"
          >
            <Icon color="secondary">content_copy</Icon>
          </IconButton>
          <Typography
            sx={{
              position: "relative",
              maxWidth: "80vw !important",
              overflow: "auto",
              whiteSpace: "pre-line",
            }}
            variant="body1"
            component="p"
            ref={graphDataEl}
          >
            {data?.graph || "-"}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%", maxWidth: "85vw !important" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon color="secondary">verified</Icon>
            <Typography color="text.secondary" gutterBottom>
              Apply
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ overflow: "auto" }}>
          <Typography
            sx={{ whiteSpace: "pre-line" }}
            variant="body1"
            component="p"
          >
            {data?.apply || "-"}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
