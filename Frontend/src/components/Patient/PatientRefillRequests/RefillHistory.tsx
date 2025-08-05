import {
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { type RaiseRefillEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { colors } from "../../../utils/Constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PatientRaiseRefillRequest from "./PatientRaiseRefillRequest";

const statusColor = {
  Wanted: "bg-red-100 text-red-800",
  "Request Raised": "bg-blue-100 text-blue-800",
  Approved: "bg-green-100 text-green-800",
};
type RefillHistoryProps = {
  patientId?: string;
};
const RefillHistory: React.FC<RefillHistoryProps> = ({ patientId }) => {
  const [refillMedications, setRefillMedications] = useState<RaiseRefillEO[]>(
    []
  );
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

  const fetchPatientRefillMedications = async () => {
    try {
      const refillMedications = await axios.get(
        `${APIEndpoints.UserProfile}?PatientId=${patientId}`
      );
      if (refillMedications.data) {
        setRefillMedications(refillMedications.data.refillMedications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPatientRefillMedications();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
      <h3 className="text-lg font-medium text-brown-700 mb-6">
        Refill History
      </h3>

      <div className="overflow-x-auto">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: colors.beige50,
                  borderBottom: 1,
                  borderBottomColor: colors.brown300,
                  color: colors.brown400,
                }}
              >
                <TableCell
                  sx={{
                    color: colors.brown500,
                  }}
                  align="center"
                >
                  Medication
                </TableCell>
                <TableCell
                  sx={{
                    color: colors.brown500,
                  }}
                  align="center"
                >
                  Prescription For
                </TableCell>

                <TableCell
                  sx={{
                    color: colors.brown500,
                  }}
                  align="center"
                >
                  Refill Quantity Needed
                </TableCell>
                <TableCell
                  sx={{
                    color: colors.brown500,
                  }}
                  align="center"
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: colors.brown500,
                  }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refillMedications &&
                refillMedications
                  ?.slice()
                  .reverse()
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((refillMedication: RaiseRefillEO, index: number) => (
                    <>
                      <TableRow key={refillMedication?.raiseRefillId ?? index}>
                        <TableCell align="center">
                          <div className="flex gap-4 items-center justify-center">
                            {refillMedication?.doseTabletsRequired !== null ? (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                                <i className="fas fa-tablets"></i>
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <i className="fas fa-capsules"></i>
                              </div>
                            )}
                            {refillMedication?.medicationName}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          {refillMedication?.prescriptionForDescription}
                        </TableCell>
                        <TableCell align="center">
                          {refillMedication?.doseTabletsRequired !== null
                            ? refillMedication?.doseTabletsRequired + " Tablets"
                            : refillMedication?.doseVolumeRequired + " Volume"}
                        </TableCell>
                        <TableCell align="center">
                          <p
                            className={`${statusColor[refillMedication?.status as keyof typeof statusColor]} p-1 rounded-2xl font-semibold`}
                          >
                            {refillMedication?.status}
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          {refillMedication?.status === "Wanted" ? (
                            <Button
                              sx={{
                                backgroundColor: colors.brown500,
                                color: "white",
                                "&:hover": {
                                  backgroundColor: colors.brown600,
                                },
                              }}
                              onClick={() =>
                                handleAccordionToggle(
                                  refillMedication?.raiseRefillId ?? ""
                                )
                              }
                            >
                              Raise Request
                              {expandedId ===
                              refillMedication?.raiseRefillId ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              )}
                            </Button>
                          ) : refillMedication?.status === "Request Raised" ? (
                            <strong>Confirmation Awaited!</strong>
                          ) : (
                            <Button></Button>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Collapse
                            in={expandedId === refillMedication?.raiseRefillId}
                          >
                            <PatientRaiseRefillRequest
                            refillMedication={refillMedication}
                              medicationId={refillMedication?.medicationId}
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
          count={refillMedications?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default RefillHistory;
