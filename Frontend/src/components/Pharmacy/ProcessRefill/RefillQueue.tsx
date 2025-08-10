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
  TablePagination,
  Collapse,
  MenuItem,
} from "@mui/material";
import {
  colors,
  formattedDateTime,
  stringAvatar,
} from "../../../utils/Constants";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ProcessRefillForm from "./ProcessRefillForm";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CommonTextfield from "../../Common/CommonTextfield";
import type { RaiseRefillEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removePharmacyProcessRefillNotificationId } from "../../../redux/features/pharmacyProcessRefillNotificationIdSlice";

const statusColor = {
  Wanted: "bg-red-100 text-red-800",
  "Request Raised": "bg-blue-100 text-blue-800",
  Approved: "bg-green-100 text-green-800",
};

interface RefillMedications extends RaiseRefillEO {
  patientName: string;
  patientDOB: string;
}
type Filter = "All" | "Request Raised" | "Approved";

type RefillQueueProps = {
  pharmacyId?: string;
};

const RefillQueue: React.FC<RefillQueueProps> = ({ pharmacyId }) => {
  const dispatch = useAppDispatch();
  const pharmacyRequestRefillNotification = useAppSelector(
    (state) => state.pharmacyProcessRefillNotification.value
  );
  const [
    pharmacyProcessRefillNotification,
    setPharmacyProcessRefillNotification,
  ] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState<Filter>("All");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const [refillMedications, setRefillMedications] = useState<
    RefillMedications[]
  >([]);

  const fetchAllPatientDetails = async () => {
    if (!refillMedications) return;

    const ids = refillMedications.map((r) => r.patientId).filter(Boolean);
    const uniqueIds = Array.from(new Set(ids));

    const newPatientDetailsMap: Record<string, { name: string; dob: string }> =
      {};

    await Promise.all(
      uniqueIds.map(async (patientId) => {
        try {
          const response = await axios.get(
            `${APIEndpoints.UserProfile}?PatientId=${patientId}`
          );
          if (response.data) {
            newPatientDetailsMap[patientId ?? " "] = {
              name: response.data.firstName + " " + response.data.lastName,
              dob: response.data.dateOfBirth,
            };
          }
        } catch (error) {
          console.error(
            "Failed to fetch patient details for:",
            patientId,
            error
          );
        }
      })
    );

    setRefillMedications((prevRefills) => {
      return prevRefills.map((refill) => {
        const patientInfo = newPatientDetailsMap[refill.patientId ?? " "];
        if (patientInfo) {
          return {
            ...refill,
            patientName: patientInfo.name,
            patientDOB: patientInfo.dob,
          };
        }
        return refill;
      });
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAccordionToggle = (id: string | null) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchPharmacyRefillMedications = async () => {
    try {
      const refillMedications = await axios.get(
        `${APIEndpoints.UserProfile}?PharmacyId=${pharmacyId}`
      );
      if (refillMedications.data) {
        setRefillMedications(refillMedications.data.refillMedications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pharmacyRequestRefillNotification !== null) {
      setPharmacyProcessRefillNotification(pharmacyRequestRefillNotification);
      dispatch(removePharmacyProcessRefillNotificationId());
    }
  }, [
    pharmacyRequestRefillNotification,
    dispatch,
    removePharmacyProcessRefillNotificationId,
  ]);

  useEffect(() => {
    fetchPharmacyRefillMedications();
  }, [pharmacyId]);

  useEffect(() => {
    if (refillMedications && refillMedications.length > 0) {
      if (!refillMedications[0]?.patientName) {
        fetchAllPatientDetails();
      }
    }
  }, [refillMedications]);

  const filteredInventory = refillMedications?.filter((item) => {
    if (pharmacyProcessRefillNotification !== null) {
      return item.raiseRefillId === pharmacyProcessRefillNotification;
    }
    const matchesSearch =
      (item.patientName &&
        item.patientName.toLowerCase().includes(search.toLowerCase())) ||
      (item.medicationName &&
        item.medicationName.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "All" || (item.status && item.status === filter);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex flex-col gap-2 mb-8">
          <Typography variant="h6" fontWeight={500} color="#1F2937">
            Refill Queue
          </Typography>
          {pharmacyProcessRefillNotification !== null ? null : (
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between my-5">
              <CommonTextfield
                variant="outlined"
                sx={{
                  width: {
                    md: "50%",
                  },
                }}
                placeholder="Search refills requests"
                className="md:col-span-2"
                disabled={!filteredInventory}
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
              <CommonTextfield
                sx={{
                  width: {
                    md: "25%",
                  },
                }}
                label="Filter Results"
                isSelect
                disabled={!filteredInventory}
                value={filter}
                onChange={(e) => {
                  const value = e.target.value as Filter;
                  setFilter(value);
                }}
                className="col-start-4"
              >
                {["All", "Request Raised", "Approved"].map((filter, index) => (
                  <MenuItem key={filter + index} value={filter}>
                    {filter}
                  </MenuItem>
                ))}
              </CommonTextfield>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: colors.beige50 }}>
                <TableRow>
                  <TableCell align="center">Patient</TableCell>
                  <TableCell align="center">Medication Name</TableCell>
                  <TableCell align="center">Quantity Required</TableCell>
                  <TableCell align="center">Requested Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory && filteredInventory.length > 0 ? (
                  filteredInventory
                    ?.slice()
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((refillMedication) => {
                      return (
                        <React.Fragment key={refillMedication?.raiseRefillId}>
                          <TableRow
                            sx={{
                              "&:hover": { backgroundColor: "#F9FAFB" },
                            }}
                          >
                            <TableCell align="center">
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  {...stringAvatar(
                                    refillMedication?.patientName ?? ""
                                  )}
                                />
                                <Box ml={2}>
                                  <Typography variant="body2" fontWeight={500}>
                                    {refillMedication?.patientName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {refillMedication?.patientDOB}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {refillMedication?.medicationName ?? " "}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              ></Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {refillMedication.doseTabletsRequired !== null
                                  ? refillMedication.doseTabletsRequired
                                  : refillMedication.doseVolumeRequired}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {formattedDateTime(
                                  refillMedication?.requestDate ?? ""
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <span
                                style={{
                                  display: "inline-flex",
                                  padding: "2px 8px",
                                  borderRadius: "999px",
                                  fontWeight: 600,
                                  fontSize: 12,
                                }}
                              >
                                <p
                                  className={`${statusColor[refillMedication?.status as keyof typeof statusColor]} p-2 rounded-2xl font-semibold`}
                                >
                                  {refillMedication?.status}
                                </p>
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              {refillMedication.status === "Request Raised" ? (
                                <>
                                  <Button
                                    onClick={() =>
                                      handleAccordionToggle(
                                        refillMedication.raiseRefillId ?? ""
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
                                    Process
                                    {expandedId ===
                                    refillMedication.raiseRefillId ? (
                                      <ArrowDropUpIcon />
                                    ) : (
                                      <ArrowDropDownIcon />
                                    )}
                                  </Button>
                                </>
                              ) : null}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              align="center"
                              colSpan={7}
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                            >
                              <Collapse
                                in={
                                  expandedId === refillMedication.raiseRefillId
                                }
                              >
                                <ProcessRefillForm
                                  refillMedication={refillMedication}
                                  onUpdate={() => {
                                    fetchPharmacyRefillMedications();
                                    setPharmacyProcessRefillNotification(null);
                                  }}
                                  handleAccordionToggle={handleAccordionToggle}
                                />
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <p className="flex text-gray-500 items-center justify-center my-4 text-xl">
                        No records available!
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pharmacyProcessRefillNotification !== null ? null : (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={filteredInventory?.length ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RefillQueue;
