import {
  Button,
  Collapse,
  Divider,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InventoryUpdateForm from "./InventoryUpdateForm";
import { colors, getStatus } from "../../../utils/Constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CommonTextfield from "../../Common/CommonTextfield";
import AddInventoryForm from "./AddInventoryForm";
import type {
  PharmacyInventory,
  MedicationObject,
  InventoryItem,
} from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removePharmacyUpdateInventoryNotificationId } from "../../../redux/features/pharmacyUpdateInventoryNotificationIdSlice";

type Filter = "All" | "In Stock" | "Low Stock" | "Out of Stock";

type InventoryActionsProps = {
  userId?: string;
  onInventoryUpdate?: () => void;
};
const InventoryActions: React.FC<InventoryActionsProps> = ({
  userId,
  onInventoryUpdate,
}) => {
  const pharmacyInventoryUpdateRequestNotificationId = useAppSelector(
    (state) => state.pharmacyUpdateInventoryNotification.value
  );

  const [pharmacyInventoryUpdateRequest, setPharmacyInventoryUpdateRequest] =
    useState<string | null>(null);

  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addInventory, setAddInventory] = useState(false);

  const [pharmacyInventory, setPharmacyInventory] = useState<InventoryItem[]>(
    []
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const handleAccordionToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchData = async () => {
    try {
      const pharmacyResponse = await axios.get(
        `${APIEndpoints.Pharmacy}/${userId}`
      );
      const pharmacyData = pharmacyResponse.data;

      if (pharmacyData && pharmacyData.pharmacyInventory) {
        const inventoryWithMedications = await Promise.all(
          pharmacyData.pharmacyInventory.map(
            async (item: PharmacyInventory) => {
              const medicationResponse = await axios.get(
                `${APIEndpoints.Admin}/medications?MedicationId=${item.medicationId}`
              );
              const medicationData: MedicationObject = medicationResponse.data;
              const status = getStatus(item);

              return {
                ...item,
                medicationName: medicationData.name,
                medicationType: medicationData.type,
                medicationFor: medicationData.description,
                status: status.status,
                statusColor: status.color,
                medicationForm: medicationData.oneTablet ? "Tablet" : "Liquid",
              };
            }
          )
        );
        setPharmacyInventory(inventoryWithMedications);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  useEffect(() => {
    if (pharmacyInventoryUpdateRequestNotificationId !== null) {
      setPharmacyInventoryUpdateRequest(
        pharmacyInventoryUpdateRequestNotificationId
      );
      dispatch(removePharmacyUpdateInventoryNotificationId());
    }
  }, [
    pharmacyInventoryUpdateRequestNotificationId,
    dispatch,
    removePharmacyUpdateInventoryNotificationId,
  ]);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const filteredInventory = pharmacyInventory?.filter((item) => {
    if (pharmacyInventoryUpdateRequest) {
      return item?.inventoryId === pharmacyInventoryUpdateRequest;
    }
    const matchesSearch =
      (item.medicationName &&
        item.medicationName.toLowerCase().includes(search.toLowerCase())) ||
      (item.medicationFor &&
        item.medicationFor.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "All" || (item.status && item.status === filter);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        {pharmacyInventoryUpdateRequest !== null ? null : (
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between my-5">
            <CommonTextfield
              className="md:col-span-3"
              variant="outlined"
              sx={{
                width: {
                  md: "50%",
                },
              }}
              placeholder="Search medications..."
              disabled={filteredInventory?.length === 0}
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
              disabled={filteredInventory?.length === 0}
              isSelect
              value={filter}
              onChange={(e) => {
                const value = e.target.value;
                setFilter(value as Filter);
              }}
            >
              {["All", "In Stock", "Low Stock", "Out of Stock"].map(
                (filter, index) => (
                  <MenuItem key={filter + index} value={filter}>
                    {filter}
                  </MenuItem>
                )
              )}
            </CommonTextfield>
          </div>
        )}
        <Divider
          sx={{
            marginY: 4,
            borderBottomWidth: 2,
            borderColor: colors.brown700,
          }}
        />

        <div className="overflow-x-auto">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Medication Name</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Condition</TableCell>
                  <TableCell align="center">Current Stock</TableCell>
                  <TableCell align="center">Reorder Threshold</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory && filteredInventory?.length > 0 ? (
                  filteredInventory
                    ?.slice()
                    .reverse()
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((item) => (
                      <>
                        <TableRow
                          key={item.inventoryId}
                          className="hover:bg-gray-50"
                        >
                          <TableCell align="center">
                            <div className="text-sm text-gray-900">
                              {item.medicationName}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div className="text-sm text-gray-900">
                              {item.medicationType}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div className="text-sm text-gray-900">
                              {item.medicationFor}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div className="text-sm text-gray-900">
                              {item.currentStockTablets !== undefined
                                ? `${item.currentStockTablets === null ? "0 tablets" : `${item.currentStockTablets} tablets`}`
                                : `${item.currentStockVolume === null ? "0 ml" : `${item.currentStockVolume} ml`}`}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div className="text-sm text-gray-900">
                              {item.reorderThresholdTablets !== undefined
                                ? `${item.reorderThresholdTablets} tablets`
                                : `${item.reorderThresholdVolume} ml`}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <span
                              className={`px-2 inline-flex text-center text-xs leading-5 font-semibold rounded-full ${
                                item.statusColor === "red"
                                  ? "bg-red-100 text-red-800"
                                  : item.statusColor === "green"
                                    ? "bg-green-100 text-green-800"
                                    : item.statusColor === "yellow"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="text-sm font-medium"
                          >
                            <Button
                              onClick={() =>
                                item.inventoryId &&
                                handleAccordionToggle(item.inventoryId)
                              }
                              sx={{
                                display: "flex",
                                color: colors.brown600,
                                marginRight: 3,
                                "&:hover": {
                                  color: colors.brown900,
                                },
                              }}
                            >
                              Update
                              {expandedId === item.inventoryId ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          >
                            <Collapse in={expandedId === item.inventoryId}>
                              <InventoryUpdateForm
                                userId={userId}
                                inventoryId={item.inventoryId as string}
                                currentStock={
                                  item.currentStockTablets !== undefined
                                    ? item.currentStockTablets
                                    : (item.currentStockVolume as number)
                                }
                                medicationThreshold={
                                  item.reorderThresholdTablets !== null
                                    ? item.reorderThresholdTablets
                                    : (item.reorderThresholdVolume as number)
                                }
                                medicationForm={item.medicationForm as string}
                                onUpdateSuccess={() => {
                                  fetchData();
                                  setPharmacyInventoryUpdateRequest(null);
                                  setTimeout(() => {
                                    handleAccordionToggle("");
                                  }, 500);
                                  if (onInventoryUpdate) {
                                    onInventoryUpdate();
                                  }
                                }}
                              />
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <div className="p-4 text-xl text-center text-gray-500">
                        {search || filter !== "All"
                          ? "No matching medications found."
                          : "No medications in inventory. Add a medication to get started."}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pharmacyInventoryUpdateRequest !== null ? null : (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={filteredInventory?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </div>
      </div>
      {pharmacyInventoryUpdateRequest !== null ? null : (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
            <h3 className="text-lg font-medium text-gray-800">
              Inventory Actions
            </h3>
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  setAddInventory((prev) => (prev === false ? true : false))
                }
                className="rounded-lg text-sm font-medium transition-colors duration-300"
                sx={{
                  backgroundColor: colors.brown600,
                  color: "white",
                  p: 1,
                  "&:hover": {
                    backgroundColor: colors.brown700,
                  },
                }}
              >
                Add Medication to Inventory
                {addInventory ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Button>
            </div>
          </div>

          <Collapse in={addInventory}>
            <AddInventoryForm
              userId={userId}
              onUpdate={() => {
                fetchData();
                if (onInventoryUpdate) {
                  onInventoryUpdate();
                }
              }}
              setAddInventoryClose={setAddInventory}
            />
          </Collapse>
        </div>
      )}
    </>
  );
};

export default InventoryActions;
