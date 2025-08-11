import * as React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import type { ModalProps } from "@mui/material/Modal";
import { colors } from "../../utils/Constants";

interface IncompleteProfileModalProps extends Omit<ModalProps, 'children'> {
    userRole: string;
    onGoToProfile: () => void;
}

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: colors.beige100,
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    border: 5,
    borderColor: colors.brown600,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
};

const IncompleteProfileModal: React.FC<IncompleteProfileModalProps> = ({
    userRole,
    onGoToProfile,
    ...modalProps
}) => {
    const modalTitle = `Welcome, ${userRole}!`;
    const modalMessage = `To ensure you have full access to all features, please complete your profile details. This is required before you can navigate to other parts of the dashboard.`;

    return (
        <Modal
            {...modalProps}
            aria-labelledby="incomplete-profile-title"
            aria-describedby="incomplete-profile-description"
            disableEscapeKeyDown={true}
            disableEnforceFocus={true}
            onClose={(event, reason) => {
                if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                    modalProps.onClose?.(event, reason);
                }
            }}
        >
            <Box sx={style}>
                <Typography id="incomplete-profile-title" variant="h5" component="h2">
                    {modalTitle}
                </Typography>
                <Typography
                    id="incomplete-profile-description"
                    sx={{ mt: 2, color: colors.brown300 }}
                >
                    {modalMessage}
                </Typography>
                <Button
                    onClick={onGoToProfile}
                    variant="contained"
                    sx={{
                        mt: 3,
                        bgcolor: colors.brown500,
                        color: "white",
                        "&:hover": {
                            bgcolor: colors.brown600,
                        },
                    }}
                >
                    Go to Profile
                </Button>
            </Box>
        </Modal>
    );
};

export default IncompleteProfileModal;