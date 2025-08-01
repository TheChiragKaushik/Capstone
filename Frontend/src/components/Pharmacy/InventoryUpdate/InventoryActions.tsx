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
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InventoryUpdateForm from "./InventoryUpdateForm";
import { colors } from "../../../utils/Constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CommonTextfield from "../../Common/CommonTextfield";
import AddInventoryForm from "./AddInventoryForm";

const dummyData = [
  {
    id: "65862-131-05",
    medication: "Amoxicillin 500mg",
    type: "Capsules • Antibiotic",
    currentStock: "45 capsules",
    reorderThreshold: "100 capsules",
    status: "Low Stock",
    statusColor: "red",
    lastUpdated: "June 14, 2023",
    dataMedicationAttr: "amoxicillin",
  },
  {
    id: "68180-513-01",
    medication: "Lisinopril 10mg",
    type: "Tablets • ACE Inhibitor",
    currentStock: "250 tablets",
    reorderThreshold: "100 tablets",
    status: "In Stock",
    statusColor: "green",
    lastUpdated: "June 15, 2023",
    dataMedicationAttr: "lisinopril",
  },
  {
    id: "65162-175-10",
    medication: "Metformin 500mg",
    type: "Tablets • Antidiabetic",
    currentStock: "320 tablets",
    reorderThreshold: "150 tablets",
    status: "In Stock",
    statusColor: "green",
    lastUpdated: "June 10, 2023",
    dataMedicationAttr: "metformin",
  },
  {
    id: "6907-833-12",
    medication: "Atorvastatin 20mg",
    type: "Tablets • Statin",
    currentStock: "90 tablets",
    reorderThreshold: "100 tablets",
    status: "Low Stock",
    statusColor: "yellow",
    lastUpdated: "June 12, 2023",
    dataMedicationAttr: "atorvastatin",
  },
  {
    id: "632-017-31",
    medication: "Metoprolol 50mg",
    type: "Tablets • Beta Blocker",
    currentStock: "142 tablets",
    reorderThreshold: "100 tablets",
    status: "In Stock",
    statusColor: "green",
    lastUpdated: "June 8, 2023",
    dataMedicationAttr: "metoprolol",
  },
  {
    id: "658631-05",
    medication: "Amoxicillin 500mg",
    type: "Capsules • Antibiotic",
    currentStock: "45 capsules",
    reorderThreshold: "100 capsules",
    status: "Low Stock",
    statusColor: "red",
    lastUpdated: "June 14, 2023",
    dataMedicationAttr: "amoxicillin",
  },
  {
    id: "68180-51",
    medication: "Lisinopril 10mg",
    type: "Tablets • ACE Inhibitor",
    currentStock: "250 tablets",
    reorderThreshold: "100 tablets",
    status: "In Stock",
    statusColor: "green",
    lastUpdated: "June 15, 2023",
    dataMedicationAttr: "lisinopril",
  },
  {
    id: "65162",
    medication: "Metformin 500mg",
    type: "Tablets • Antidiabetic",
    currentStock: "320 tablets",
    reorderThreshold: "150 tablets",
    status: "In Stock",
    statusColor: "green",
    lastUpdated: "June 10, 2023",
    dataMedicationAttr: "metformin",
  },
];

const InventoryActions = () => {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

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

  const [addInventory, setAddInventory] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const handleAccordionToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <AddInventoryForm />
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
            <MenuItem>In Stock</MenuItem>
            <MenuItem>Low Stock</MenuItem>
            <MenuItem>Out of Stock</MenuItem>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Medication</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Reorder Threshold</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <>
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">
                            {item.medication}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{item.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {item.currentStock}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {item.reorderThreshold}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {item.lastUpdated}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        <TableCell className="text-sm font-medium">
                          <Button
                            onClick={() => handleAccordionToggle(item.id)}
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
                            {expandedId === item.id ? (
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
                          <Collapse in={expandedId === item.id}>
                            <InventoryUpdateForm />
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
            count={dummyData.length}
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
