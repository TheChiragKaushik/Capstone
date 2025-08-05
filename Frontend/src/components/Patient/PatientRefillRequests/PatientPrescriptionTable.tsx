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
import { type PatientEO, type Prescription } from "../../../utils/Interfaces";
import type React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useEffect, useState } from "react";
import { colors } from "../../../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import PatientMedicationsPrescribed from "./PatientMedicationsPrescribed";

type PatientPrescriptionTableProps = {
  userId?: string;
};

const PatientPrescriptionTable: React.FC<PatientPrescriptionTableProps> = ({
  userId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [user, setUser] = useState<PatientEO>({} as PatientEO);

  const fetchPatientDetails = async (userId: string) => {
    setUser({} as PatientEO);

    try {
      const patientResponse = await axios.get(
        `${APIEndpoints.UserProfile}?PatientId=${userId}`
      );

      if (!patientResponse.data) {
        return;
      }

      const patientData = patientResponse.data;

      if (
        patientData.prescriptions &&
        Array.isArray(patientData.prescriptions)
      ) {
        const prescriptionsWithDetails = await Promise.all(
          patientData.prescriptions.map(async (prescription: Prescription) => {
            const providerResponse = await axios.get(
              `${APIEndpoints.UserProfile}?ProviderId=${prescription.providerId}`
            );
            const providedBy = providerResponse.data;

            const medsWithDetails = await Promise.all(
              (prescription.medicationsPrescribed || []).map(async (med) => {
                const medResponse = await axios.get(
                  `${APIEndpoints.Admin}/medications?MedicationId=${med.medicationId}`
                );
                return {
                  ...med,
                  medication: medResponse.data,
                };
              })
            );
            return {
              ...prescription,
              prescribedBy: providedBy,
              medicationsPrescribed: medsWithDetails,
            };
          })
        );
        patientData.prescriptions = prescriptionsWithDetails;
      }

      setUser(patientData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPatientDetails(userId);
    }
  }, []);

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
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: colors.beige50 }}>
            <TableRow>
              <TableCell align="center">S.No</TableCell>
              <TableCell align="center">Prescription By</TableCell>
              <TableCell align="center">Prescription For</TableCell>
              <TableCell align="center">Medications</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user?.prescriptions?.map(
              (prescription: Prescription, idx: number) => (
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
                        <PatientMedicationsPrescribed
                          medicationPrescribed={
                            prescription?.medicationsPrescribed
                          }
                        />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              )
            )}
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
    </div>
  );
};

export default PatientPrescriptionTable;
