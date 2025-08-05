import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Collapse,
  TablePagination,
} from "@mui/material";
import type { PatientEO, Prescription } from "../../../utils/Interfaces";
import type React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useState } from "react";
import { colors } from "../../../utils/Constants";
import MedicationsPrescribed from "./MedicationsPrescribed";

type PrescriptionTableProps = {
  user?: PatientEO;
};

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({ user }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleAccordionToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
            <TableRow
              sx={{
                background: colors.beige50,
                borderBottom: 1,
                borderBottomColor: colors.brown300,
                color: colors.brown400,
              }}
            >
              <TableCell align="center">S.No</TableCell>
              <TableCell align="center">Prescription By</TableCell>
              <TableCell align="center">Prescription For</TableCell>
              <TableCell align="center">Medications</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user?.prescriptions
              ?.slice()
              .reverse()
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((prescription: Prescription, idx: number) => (
                <>
                  <TableRow key={prescription.prescriptionId ?? idx}>
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell align="center">
                      {prescription.prescribedBy?.firstName}{" "}
                      {prescription.prescribedBy?.lastName}
                    </TableCell>
                    <TableCell align="center">
                      {prescription.prescriptionForDescription}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          handleAccordionToggle(
                            prescription?.prescriptionId ?? ""
                          )
                        }
                        sx={{
                          color: colors.brown600,
                          backgroundColor: colors.beige200,
                          fontWeight: 500,
                          textTransform: "none",
                          "&:hover": { color: colors.brown700 },
                        }}
                        size="small"
                      >
                        Medications Prescribed
                        {expandedId === prescription.prescriptionId ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse in={expandedId === prescription.prescriptionId}>
                        <MedicationsPrescribed
                          medicationPrescribed={
                            prescription?.medicationsPrescribed
                          }
                        />
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
        count={user?.prescriptions?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default PrescriptionTable;
