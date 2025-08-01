import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  Typography,
  Box,
  InputAdornment,
  MenuItem,
  TablePagination,
  Collapse,
} from "@mui/material";
import { colors } from "../../../utils/Constants";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ProcessRefillForm from "./ProcessRefillForm";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CommonTextfield from "../../Common/CommonTextfield";

const rows = [
  {
    initials: "RJ",
    name: "Robert Johnson",
    dob: "11/04/1962",
    medication: "Metoprolol",
    medDetail: "Beta Blocker",
    dosage: "50mg",
    quantity: "30 tablets",
    requested: "Today, 9:58 AM",
    status: "Pending",
    statusColor: "yellow",
    id: 1,
  },
  {
    initials: "SW",
    name: "Sarah Williams",
    dob: "09/28/1990",
    medication: "Levothyroxine",
    medDetail: "Thyroid Hormone",
    dosage: "75mcg",
    quantity: "90 tablets",
    requested: "Yesterday, 4:32 PM",
    status: "Urgent",
    statusColor: "red",
    id: 2,
  },
  {
    initials: "JD",
    name: "John Doe",
    dob: "06/15/1985",
    medication: "Lisinopril",
    medDetail: "ACE Inhibitor",
    dosage: "10mg",
    quantity: "30 tablets",
    requested: "Yesterday, 2:15 PM",
    status: "Pending",
    statusColor: "yellow",
    id: 3,
  },
  {
    initials: "MG",
    name: "Maria Garcia",
    dob: "03/22/1978",
    medication: "Atorvastatin",
    medDetail: "Statin",
    dosage: "20mg",
    quantity: "30 tablets",
    requested: "Yesterday, 11:45 AM",
    status: "Pending",
    statusColor: "yellow",
    id: 4,
  },
];

const RefillQueue = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const handleAccordionToggle = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex flex-col gap-2 mb-8">
          <Typography variant="h6" fontWeight={500} color="#1F2937">
            Refill Queue
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <CommonTextfield
              variant="outlined"
              size="small"
              placeholder="Search refills requests"
              className="md:col-span-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 1.5 }}>
                      <SearchIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: { pl: "6px" },
                },
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Requested</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <>
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:hover": { backgroundColor: "#F9FAFB" },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: "#FFF6E5",
                                color: "#8B5E3C",
                                width: 32,
                                height: 32,
                                fontWeight: "bold",
                                fontSize: 16,
                              }}
                            >
                              {row.initials}
                            </Avatar>
                            <Box ml={2}>
                              <Typography variant="body2" fontWeight={500}>
                                {row.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                DOB: {row.dob}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.medication}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.medDetail}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.dosage}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.requested}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "inline-flex",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              fontWeight: 600,
                              fontSize: 12,
                              backgroundColor:
                                row.statusColor === "yellow"
                                  ? "#FEF3C7"
                                  : row.statusColor === "red"
                                    ? "#FEE2E2"
                                    : "#E0E7FF",
                              color:
                                row.statusColor === "yellow"
                                  ? "#B45309"
                                  : row.statusColor === "red"
                                    ? "#B91C1C"
                                    : "#3730A3",
                            }}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleAccordionToggle(row.id)}
                            sx={{
                              color: colors.brown600,
                              backgroundColor: colors.beige200,
                              fontWeight: 500,
                              textTransform: "none",
                              "&:hover": { color: colors.brown700 },
                            }}
                            size="small"
                          >
                            Process
                            {expandedId === row.id ? (
                              <ArrowDropUpIcon />
                            ) : (
                              <ArrowDropDownIcon />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <Collapse in={expandedId === row.id}>
                            <ProcessRefillForm />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default RefillQueue;
