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
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InventoryUpdateForm from "./InventoryUpdateForm";
import { colors, getStatus } from "../../../utils/Constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CommonTextfield from "../../Common/CommonTextfield";
import AddInventoryForm from "./AddInventoryForm";
import type {
  CommonRouteProps,
  PharmacyInventory,
  MedicationObject,
  InventoryItem,
} from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";

const InventoryActions = ({ userId }: CommonRouteProps) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addInventory, setAddInventory] = useState(false);

  const [pharmacyInventory, setPharmacyInventory] = useState<
    InventoryItem[] | undefined
  >([]);

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

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredInventory = pharmacyInventory?.filter((item) => {
    const matchesSearch =
      (item.medicationName &&
        item.medicationName.toLowerCase().includes(search.toLowerCase())) ||
      (item.medicationFor &&
        item.medicationFor.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (item.status && item.status.toLowerCase() === filter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <>
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
          <AddInventoryForm userId={userId} />
        </Collapse>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <CommonTextfield
            className="md:col-span-3"
            variant="outlined"
            size="small"
            placeholder="Search medications..."
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
            label="Status"
            value={filter}
            size="small"
            onChange={(e) => setFilter(e.target.value)}
            isSelect
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="in stock">In Stock</MenuItem>
            <MenuItem value="low stock">Low Stock</MenuItem>
            <MenuItem value="out of stock">Out of Stock</MenuItem>
          </CommonTextfield>
        </div>
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
                                medicationForm={item.medicationForm as string}
                                onUpdateSuccess={() => {
                                  fetchData();
                                  setTimeout(() => {
                                    handleAccordionToggle("");
                                  }, 500);
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
                      <div className="p-4 text-center text-gray-500">
                        {search || filter !== "all"
                          ? "No matching medications found."
                          : "No medications in inventory. Add a medication to get started."}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={filteredInventory?.length || 0}
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

export default InventoryActions;
