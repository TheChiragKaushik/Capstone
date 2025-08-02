import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Alert,
  Skeleton,
} from "@mui/material";
import type { Medication } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";

type MedicationDetailsProps = {
  medicationId: string | null;
};

const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  medicationId,
}) => {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!medicationId) {
      setMedication(null);
      return;
    }

    const getMedicationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${APIEndpoints.Admin}/medications?MedicationId=${medicationId}`
        );
        if (response.data) {
          setMedication(response.data);
        } else {
          setMedication(null);
          setError("Medication details not found.");
        }
      } catch (err) {
        console.error("Error fetching medication details:", err);
        setError("Failed to fetch medication details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getMedicationDetails();
  }, [medicationId]);

  if (!medicationId) {
    return null;
  }

  const renderSkeleton = () => (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Skeleton variant="text" width="60%" />
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </Box>
        <Divider sx={{ mb: 1, mt: 1 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <Skeleton variant="text" width="50%" />
        </Typography>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return (
      <Box sx={{ my: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!medication) {
    return (
      <Box sx={{ my: 2 }}>
        <Alert severity="info">No medication details available.</Alert>
      </Box>
    );
  }

  const isTablet =
    (medication.oneTablet !== null && medication.oneTablet !== undefined) ||
    (medication.tabletsInPack !== null &&
      medication.tabletsInPack !== undefined);
  const isLiquid =
    (medication.volumePerDose !== null &&
      medication.volumePerDose !== undefined) ||
    (medication.totalVolume !== null && medication.totalVolume !== undefined);

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {medication?.name ?? "Unnamed Medication"}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {medication?.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {medication?.description}
          </Typography>
        )}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2">
            Type: <b>{medication?.type ?? "N/A"}</b>
          </Typography>
          <Typography variant="subtitle2">
            ID: <b>{medication?._id}</b>
          </Typography>
        </Box>

        {isTablet && (
          <>
            <Divider sx={{ mb: 1, mt: 1 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tablet Details
            </Typography>
            {medication.oneTablet !== undefined &&
              medication.oneTablet !== null && (
                <Typography>
                  One Tablet: <b>{medication.oneTablet}</b>
                  {medication.unitMeasure && ` ${medication.unitMeasure}`}
                </Typography>
              )}
            {medication.tabletsInPack !== undefined &&
              medication.tabletsInPack !== null && (
                <Typography>
                  Tablets in Pack: <b>{medication.tabletsInPack}</b>
                </Typography>
              )}
          </>
        )}

        {isLiquid && (
          <>
            <Divider sx={{ mb: 1, mt: 1 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Liquid Details
            </Typography>
            {medication.volumePerDose !== undefined &&
              medication.volumePerDose !== null && (
                <Typography>
                  Volume per Dose: <b>{medication.volumePerDose}</b>
                  {medication.liquidUnitMeasure &&
                    ` ${medication.liquidUnitMeasure}`}
                </Typography>
              )}
            {medication.totalVolume !== undefined &&
              medication.totalVolume !== null && (
                <Typography>
                  Total Volume: <b>{medication.totalVolume}</b>
                  {medication.liquidUnitMeasure &&
                    ` ${medication.liquidUnitMeasure}`}
                </Typography>
              )}
          </>
        )}

        {!isTablet && !isLiquid && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Neither tablet nor liquid details are available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationDetails;
