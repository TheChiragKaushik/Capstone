import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { colors } from "../../../utils/Constants";
import type { PatientEO } from "../../../utils/Interfaces";
import type React from "react";

type UpcomingMedicationTableProps = {
  user?: PatientEO;
};

const TableHeaders = ["Medication", "Dosage", "Time", "Instructions", "Status"];

const UpcomingMedicationTable: React.FC<
  UpcomingMedicationTableProps
> = ({}) => (
  <Paper
    className="rounded-lg shadow-sm p-6 border mb-8"
    style={{ borderColor: colors.beige100, background: "#fff" }}
    elevation={0}
  >
    <Box className="flex justify-between items-center mb-6">
      <Typography
        variant="h6"
        className="font-semibold"
        sx={{ color: colors.brown700, fontSize: "1.25rem" }}
      >
        Upcoming Medications
      </Typography>
      <Button
        variant="text"
        size="small"
        className="flex items-center"
        sx={{
          color: colors.brown500,
          fontSize: "0.875rem",
          textTransform: "none",
          "&:hover": { color: colors.brown600, background: "none" },
        }}
        endIcon={<i className="fas fa-chevron-right text-xs" />}
      >
        View all
      </Button>
    </Box>

    <TableContainer className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHead>
          <TableRow style={{ background: colors.beige50 }}>
            {TableHeaders.map((header) => (
              <TableCell
                key={header}
                className="px-6 py-3"
                sx={{
                  color: colors.brown500,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  letterSpacing: 1,
                  borderBottom: `1px solid ${colors.beige200}`,
                  background: colors.beige50,
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Row 1 */}
          <TableRow>
            <TableCell className="px-6 py-4">
              <Box className="flex items-center">
                <Box
                  className="flex items-center justify-center"
                  sx={{
                    background: "#DBEAFE", // bg-blue-100
                    color: "#3B82F6", // text-blue-500
                    borderRadius: "9999px",
                    width: 32,
                    height: 32,
                  }}
                >
                  <i className="fas fa-capsules" />
                </Box>
                <Box ml={2}>
                  <Typography
                    sx={{
                      color: colors.brown700,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Metformin
                  </Typography>
                  <Typography sx={{ color: colors.brown400, fontSize: 12 }}>
                    500mg tablet
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                1 tablet
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                1:00 PM
              </Typography>
              <Typography sx={{ color: colors.brown400, fontSize: 12 }}>
                Today
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                Take with lunch
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <span
                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                style={{
                  background: "#FEF08A", // bg-yellow-100
                  color: "#854D0E", // text-yellow-800
                }}
              >
                Upcoming
              </span>
            </TableCell>
          </TableRow>

          {/* Row 2 */}
          <TableRow>
            <TableCell className="px-6 py-4">
              <Box className="flex items-center">
                <Box
                  className="flex items-center justify-center"
                  sx={{
                    background: "#E9D5FF", // bg-purple-100
                    color: "#A78BFA", // text-purple-500
                    borderRadius: "9999px",
                    width: 32,
                    height: 32,
                  }}
                >
                  <i className="fas fa-pills" />
                </Box>
                <Box ml={2}>
                  <Typography
                    sx={{
                      color: colors.brown700,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Atorvastatin
                  </Typography>
                  <Typography sx={{ color: colors.brown400, fontSize: 12 }}>
                    20mg tablet
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                1 tablet
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                8:00 PM
              </Typography>
              <Typography sx={{ color: colors.brown400, fontSize: 12 }}>
                Today
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                Take before bedtime
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <span
                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                style={{
                  background: "#FEF08A", // bg-yellow-100
                  color: "#854D0E", // text-yellow-800
                }}
              >
                Upcoming
              </span>
            </TableCell>
          </TableRow>

          {/* Row 3 */}
          <TableRow>
            <TableCell className="px-6 py-4">
              <Box className="flex items-center">
                <Box
                  className="flex items-center justify-center"
                  sx={{
                    background: "#BBF7D0", // bg-green-100
                    color: "#22C55E", // text-green-500
                    borderRadius: "9999px",
                    width: 32,
                    height: 32,
                  }}
                >
                  <i className="fas fa-tablets" />
                </Box>
                <Box ml={2}>
                  <Typography
                    sx={{
                      color: colors.brown700,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Lisinopril
                  </Typography>
                  <Typography sx={{ color: colors.brown400, fontSize: 12 }}>
                    10mg tablet
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                1 tablet
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                8:00 AM
              </Typography>
              <Typography sx={{ color: colors.brown400, fontSize: 12 }}>
                Tomorrow
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <Typography sx={{ color: colors.brown700, fontSize: 14 }}>
                Take with breakfast
              </Typography>
            </TableCell>
            <TableCell className="px-6 py-4">
              <span
                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                style={{
                  background: "#DBEAFE", // bg-blue-100
                  color: "#1D4ED8", // text-blue-800
                }}
              >
                Tomorrow
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default UpcomingMedicationTable;
