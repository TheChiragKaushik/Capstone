import React, { useEffect, useRef, useState } from "react";
import {
  type MedicationPrescribed,
  type RaiseRefillEO,
} from "../../../utils/Interfaces";
import { colors } from "../../../utils/Constants";
import { Box, Button, Fade } from "@mui/material";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import type { Router } from "@toolpad/core/AppProvider";

type RefillNotificationProps = {
  notification?: RaiseRefillEO;
  onClose?: () => void;
  navigateToRoute?: Router;
};

const DEFAULT_RING_ID = "6890a2df83c52777f2a65306";

const RefillNotification: React.FC<RefillNotificationProps> = ({
  notification,
  onClose,
  navigateToRoute,
}) => {
  const [medicationPrescribed, setMedicationPrescribed] =
    useState<MedicationPrescribed>({});
  const [sounds, setSounds] = useState<
    { _id: string; url: string; name?: string }[]
  >([]);
  const [defaultRingUrl, setDefaultRingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const fetchAllSounds = async () => {
    try {
      const res = await axios.get(`${APIEndpoints.Admin}/ringtones`);
      if (res.data) {
        setSounds(res.data);
        const defaultSound = res.data.find(
          (sound: { _id: string; url: string; name?: string }) =>
            sound._id === DEFAULT_RING_ID
        );
        setDefaultRingUrl(defaultSound?.url || null);
      }
    } catch (error) {
      console.error("Failed to fetch sounds:", error);
    }
  };

  useEffect(() => {
    fetchAllSounds();
  }, []);

  useEffect(() => {
    if (!sounds.length) return;

    if (notification) {
      const soundId = notification.soundUrl;
      let soundToPlay = defaultRingUrl;

      if (soundId) {
        const matchedSound = sounds.find((sound) => sound._id === soundId);
        if (matchedSound) {
          soundToPlay = matchedSound.url;
        }
      }

      if (soundToPlay) {
        const audio = new window.Audio(soundToPlay);
        audio.loop = true;
        audio.play();
        audioRef.current = audio;
      }
    }

    return () => {
      stopAudio();
    };
  }, [notification, sounds, defaultRingUrl]);

  useEffect(() => {
    const getMedicationPrescribed = async () => {
      try {
        const medicationPrescribed = await axios.get(
          `${APIEndpoints.Patient}/medication-prescribed/${notification?.patientId}?PrescriptionId=${notification?.prescriptionId}&MedicationPrescribedId=${notification?.medicationPrescribedId}`
        );
        if (medicationPrescribed.data) {
          setMedicationPrescribed(medicationPrescribed.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMedicationPrescribed();
  }, [notification]);

  useEffect(() => {
    if (!onClose) return;
    const timeout = setTimeout(() => {
      stopAudio();
      if (onClose) onClose();
    }, 60000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  const handleOrderRefill = () => {
    stopAudio();
    navigateToRoute?.navigate("refillRequests");
    if (onClose) onClose();
  };

  return (
    <>
      <Fade in={true}>
        <Box
          sx={{
            position: "fixed",
            zIndex: 1400,
            right: { xs: "50%", sm: "50%", md: 24 },
            left: { xs: "50%", sm: "50%", md: "auto" },
            transform: {
              xs: "translate(-50%, 0)",
              sm: "translate(-50%, 0)",
              md: "none",
            },
            bottom: 24,
            minWidth: 310,
            maxWidth: 440,
          }}
        >
          <div className="bg-white rounded-xl p-6 border-l-4 border-brown-400">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <i
                    className="fa-solid fa-pills fa-lg"
                    style={{ color: colors.brown500 }}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-brown-600">
                      Refill Reminder
                    </h3>
                    <span className="bg-brown-100 text-brown-600 text-xs text-center px-2 py-1 rounded-full font-medium">
                      Low Stock
                    </span>
                  </div>
                  <p className="text-brown-500 mb-2">
                    Your <strong> {notification?.medicationName} </strong> is
                    running low
                  </p>
                  <div className="text-sm text-brown-400 space-y-1">
                    <p>
                      📦 Only{" "}
                      {medicationPrescribed?.currentTabletsInHand !== null
                        ? medicationPrescribed?.currentTabletsInHand
                        : medicationPrescribed?.currentVolumeInhand}{" "}
                      doses remaining
                    </p>
                    <p>🏪 {notification?.message} </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <Button
                      onClick={handleOrderRefill}
                      sx={{
                        backgroundColor: colors.brown500,
                        color: "white",
                        "&:hover": {
                          backgroundColor: colors.brown600,
                        },
                      }}
                      className="rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brown-400"
                    >
                      Order Refill
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </>
  );
};

export default RefillNotification;
