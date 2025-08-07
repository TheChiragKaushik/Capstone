import { Button, MenuItem, Typography, Snackbar, Alert } from "@mui/material";
import { colors } from "../../../utils/Constants";
import CommonTextfield from "../../Common/CommonTextfield";
import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import type { AlarmRingtones, PharmacyEO } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";

type PharmacySelectNotificationSoundProps = {
  user?: PharmacyEO;
};

const PharmacySelectNotificationSound: React.FC<
  PharmacySelectNotificationSoundProps
> = ({ user }) => {
  const [activeField, setActiveField] = useState<
    "refillRequestReminderNotification" | "inventoryUpdateNotification"
  >("refillRequestReminderNotification");

  const [allSounds, setAllSounds] = useState<AlarmRingtones[]>([]);

  const [
    refillRequestReminderNotificationId,
    setRefillRequestReminderNotificationId,
  ] = useState<string>("");
  const [inventoryUpdateNotificationId, setInventoryUpdateNotificationId] =
    useState<string>("");

  const [selectedSound, setSelectedSound] = useState<AlarmRingtones | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchAllSounds = async () => {
    try {
      const res = await axios.get(`${APIEndpoints.Admin}/ringtones`);
      if (res.data) {
        setAllSounds(res.data);
      }
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to load sounds");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchAllSounds();
  }, []);

  useEffect(() => {
    if (user?.soundPreference && allSounds.length) {
      const refillRequestSoundId =
        allSounds.find(
          (s) =>
            s._id ===
            user.soundPreference?.refillRequestReminderNotificationSound
        )?._id || "";
      const inventorySoundId =
        allSounds.find(
          (s) =>
            s._id === user.soundPreference?.inventoryUpdateNotificationSound
        )?._id || "";

      setRefillRequestReminderNotificationId(refillRequestSoundId);
      setInventoryUpdateNotificationId(inventorySoundId);

      const initialId =
        activeField === "refillRequestReminderNotification"
          ? refillRequestSoundId
          : inventorySoundId;
      const foundSound = allSounds.find((s) => s._id === initialId) || null;
      setSelectedSound(foundSound);
    }
  }, [user, allSounds, activeField]);

  useEffect(() => {
    const selectedId =
      activeField === "refillRequestReminderNotification"
        ? refillRequestReminderNotificationId
        : inventoryUpdateNotificationId;
    const sound = allSounds.find((s) => s._id === selectedId) || null;
    setSelectedSound(sound);
  }, [
    activeField,
    refillRequestReminderNotificationId,
    inventoryUpdateNotificationId,
    allSounds,
  ]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  const handleSoundSelect = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedId = e.target.value as string;

    if (activeField === "refillRequestReminderNotification") {
      setRefillRequestReminderNotificationId(selectedId);
    } else {
      setInventoryUpdateNotificationId(selectedId);
    }

    const sound = allSounds.find((sound) => sound._id === selectedId) || null;
    setSelectedSound(sound);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const currentSoundUrl = selectedSound?.url || "";

  const handleSubmit = async () => {
    if (
      (activeField === "refillRequestReminderNotification" &&
        !refillRequestReminderNotificationId) ||
      (activeField === "inventoryUpdateNotification" &&
        !inventoryUpdateNotificationId)
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please select a sound first!");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      refillRequestReminderNotificationSound:
        refillRequestReminderNotificationId,
      inventoryUpdateNotificationSound: inventoryUpdateNotificationId,
    };

    try {
      const response = await axios.put(
        `${APIEndpoints.Pharmacy}/notification-sounds/${user?._id}`,
        payload
      );
      if (response.data) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Notification sound saved successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to save notification sound.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
      <CommonHeading subHeading="Select Custom Sounds for notifications" />
      <div className="flex gap-6 items-center justify-center my-6">
        <Typography
          onClick={() => setActiveField("refillRequestReminderNotification")}
          className={`cursor-pointer text-xs rounded-lg p-2 border border-brown-500 text-white ${
            activeField === "refillRequestReminderNotification"
              ? "bg-brown-500 border-beige-400"
              : "bg-brown-300 border-brown-500 text-brown-500"
          }`}
        >
          Refill Request Notification
        </Typography>
        <Typography
          onClick={() => setActiveField("inventoryUpdateNotification")}
          className={`cursor-pointer rounded-lg p-2 border border-brown-500 text-white ${
            activeField === "inventoryUpdateNotification"
              ? "bg-brown-500 border-beige-400"
              : "bg-brown-300 border-brown-500 text-brown-500"
          }`}
        >
          Inventory Reminder Notification
        </Typography>
      </div>

      <div className="flex gap-6 flex-col items-center justify-center">
        <CommonTextfield
          autoFocus={false}
          label={`Select ${
            activeField === "refillRequestReminderNotification"
              ? "Dose"
              : "Refill"
          } Notification`}
          isSelect
          onChange={handleSoundSelect}
          name={activeField}
          value={
            activeField === "refillRequestReminderNotification"
              ? refillRequestReminderNotificationId
              : inventoryUpdateNotificationId
          }
          sx={{
            width: {
              md: "30%",
            },
          }}
        >
          {allSounds.map((sound) => (
            <MenuItem key={sound?._id} value={sound._id}>
              {sound?.name}
            </MenuItem>
          ))}
        </CommonTextfield>

        <div className="min-w-60 flex flex-col justify-center items-center gap-4 bg-brown-300 border-brown-500 border rounded-xl p-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <i
                className="fa-solid fa-bell bg-beige-200 p-4 rounded-full"
                style={{ color: colors.brown500 }}
              ></i>
              <div>
                <h3 className="font-semibold text-brown-600">
                  {selectedSound?.name || "Select Sound"}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10 items-center">
            <div className={`flex gap-0.5 items-end h-6`}>
              {[2, 3, 4, 5, 3.5, 2.5, 2].map((baseHeight, idx) => (
                <div
                  key={idx}
                  className={`bg-beige-100 w-2 rounded-sm ${
                    isPlaying ? "animate-bar" : ""
                  }`}
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                    height: `${baseHeight}rem`,
                    animationDuration: "1s",
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="flex mt-4 items-center justify-center">
            <Button
              onClick={togglePlay}
              sx={{
                minWidth: "40px",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: colors.beige200,
                color: colors.brown500,
                "&:hover": {
                  backgroundColor: colors.beige300,
                },
              }}
            >
              {!isPlaying ? (
                <i className="fa-solid fa-play"></i>
              ) : (
                <i className="fa-solid fa-pause"></i>
              )}
            </Button>
            <audio
              ref={audioRef}
              src={currentSoundUrl || undefined}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
              onEnded={handleAudioPause}
              preload="auto"
            />
          </div>
        </div>

        <Button
          sx={{
            backgroundColor: colors.brown500,
            width: {
              md: "25%",
            },
            color: "white",
            "&:hover": {
              backgroundColor: colors.brown600,
            },
          }}
          onClick={handleSubmit}
        >
          Select Sound
        </Button>
      </div>

      <style>{`
        @keyframes barPulse {
          0%, 100% { height: 0.5rem; opacity: 0.5; }
          50% { height: 1.5rem; opacity: 1; }
        }
        .animate-bar {
          animation-name: barPulse;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      `}</style>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PharmacySelectNotificationSound;
