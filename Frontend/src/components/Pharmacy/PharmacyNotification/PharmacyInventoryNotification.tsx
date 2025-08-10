import type { Router } from "@toolpad/core/AppProvider";
import type { InventoryRestockReminderNotification } from "../../../utils/Interfaces";
import type React from "react";
import { Box, Button, Fade } from "@mui/material";
import { colors } from "../../../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { addPharmacyUpdateInventoryNotificationId } from "../../../redux/features/pharmacyUpdateInventoryNotificationIdSlice";
import { removeAppNotification } from "../../../redux/features/appNotificationsSlice";
import { fetchAllPharmacyNotifications } from "../../../redux/features/pharmacyNotificationsSlice";

const DEFAULT_RING_ID = "6890a2df83c52777f2a65306";

type PharmacyInventoryNotificationProps = {
  notification?: InventoryRestockReminderNotification;
  navigateToRoute?: Router;
  userId?: string;
};

const PharmacyInventoryNotification: React.FC<
  PharmacyInventoryNotificationProps
> = ({ notification, userId, navigateToRoute }) => {
  const dispatch = useAppDispatch();
  const [sounds, setSounds] = useState<
    { _id: string; url: string; name?: string }[]
  >([]);
  const [userSoundPreference, setUserSoundPrefrence] = useState<string>();
  const [defaultRingUrl, setDefaultRingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const fetchPharmacySoundPreference = async () => {
    try {
      const response = await axios.get(
        `${APIEndpoints.UserProfile}?PharmacyId=${userId}`
      );
      if (response.data) {
        setUserSoundPrefrence(
          response.data.soundPreference.refillRequestReminderNotificationSound
        );
      }
    } catch (error) {
      console.error(error);
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
    fetchPharmacySoundPreference();
  }, []);

  useEffect(() => {
    if (!sounds.length) return;

    if (notification) {
      const soundId = userSoundPreference;
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
    if (!notification?.inventoryRestockReminderNotificationId) {
      return;
    }
    const timeout = setTimeout(() => {
      stopAudio();
      dispatch(
        removeAppNotification(
          notification?.inventoryRestockReminderNotificationId ?? ""
        )
      );
    }, 60000);

    return () => clearTimeout(timeout);
  }, [dispatch, notification]);

  const handleInventory = async () => {
    dispatch(
      addPharmacyUpdateInventoryNotificationId(notification?.inventoryId)
    );
    try {
      const checkNotificationPayload = {
        pharmacyId: userId,
        fieldToUpdateId: notification?.inventoryRestockReminderNotificationId,
      };
      const checkNotification = await axios.put(
        `${APIEndpoints.Pharmacy}/check?inventory=true`,
        checkNotificationPayload
      );
      if (!checkNotification.data) {
        return;
      }
    } catch (error) {
      console.error(error);
    }
    stopAudio();
    dispatch(
      removeAppNotification(
        notification?.inventoryRestockReminderNotificationId ?? ""
      )
    );
    dispatch(fetchAllPharmacyNotifications(userId ?? ""));
    navigateToRoute?.navigate("inventoryUpdate");
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
          <div className="bg-white rounded-xl p-6 border-l-4 border-brown-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <i
                    className="fa-solid fa-clock fa-lg"
                    style={{ color: colors.brown500 }}
                  ></i>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-brown-600">
                      Medication out of Stock!
                    </h3>
                    <div className="pulse-dot w-2 h-2 bg-brown-500 rounded-full"></div>
                  </div>
                  <strong>{notification?.medicationName}</strong>
                  <p className="text-brown-500 mb-2">{notification?.message}</p>
                  <div className="flex items-center space-x-3 mt-10">
                    <Button
                      onClick={handleInventory}
                      sx={{
                        backgroundColor: colors.brown600,
                        color: "white",
                        "&:hover": {
                          backgroundColor: colors.brown700,
                        },
                      }}
                      className="rounded-lg text-sm font-medium hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-400"
                    >
                      Update Inventory
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

export default PharmacyInventoryNotification;
