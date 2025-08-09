import { useState } from "react";
import RoleConfig from "../../utils/RoleConfig";
import { Avatar, Badge, Button } from "@mui/material";
import { Account } from "@toolpad/core/Account";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { colors, stringAvatar } from "../../utils/Constants";
import type { PatientEO, PharmacyEO, ProviderEO } from "../../utils/Interfaces";
import { useAppSelector } from "../../redux/hooks";
import type { Router } from "@toolpad/core/AppProvider";

type ToolbarActionsSearchProps = {
  role: string;
  user?: PatientEO | ProviderEO | PharmacyEO;
  navigateToRoute?: Router;
};

const ToolbarActionsSearch: React.FC<ToolbarActionsSearchProps> = ({
  role,
  user,
  navigateToRoute,
}) => {
  const name: string | undefined = (() => {
    if (role === "Pharmacy" && user && "name" in user) {
      return user.name;
    }
    if (user && "firstName" in user && "lastName" in user) {
      return user.firstName + " " + user.lastName;
    }
    return undefined;
  })();

  const [handleAside, setHandleAside] = useState(false);

  const handleToggleAside = () => {
    setHandleAside((prev) => !prev);
  };

  const NotificationPanelComponent = RoleConfig[role]?.notifications?.panel;

  const newNotificationsCount = useAppSelector(
    (state) => state.patientNotifications.newNotificationsCount
  );

  return (
    <div className="flex">
      {NotificationPanelComponent && (
        <Button onClick={handleToggleAside}>
          <Badge badgeContent={newNotificationsCount} color="error">
            <CircleNotificationsIcon
              sx={{
                color: colors.brown600,
              }}
            />
          </Badge>
        </Button>
      )}
      {NotificationPanelComponent && (
        <NotificationPanelComponent
          onClose={handleToggleAside}
          visibility={handleAside ? "visible" : "hidden"}
          userId={user?._id}
          navigateToRoute={navigateToRoute}
        />
      )}
      <Account
        slotProps={{
          preview: {
            slots: {
              avatar: () => <Avatar {...stringAvatar(name ?? "User")} />,
            },
          },
        }}
      />
    </div>
  );
};

export default ToolbarActionsSearch;
