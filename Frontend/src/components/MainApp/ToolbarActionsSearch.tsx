import { useState } from "react";
import RoleConfig from "../../utils/RoleConfig";
import { Avatar, Button } from "@mui/material";
import { Account } from "@toolpad/core/Account";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { colors, stringAvatar } from "../../utils/Constants";
import type { PatientEO, PharmacyEO, ProviderEO } from "../../utils/Interfaces";

type ToolbarActionsSearchProps = {
  role: string;
  user?: PatientEO | ProviderEO | PharmacyEO;
};

const ToolbarActionsSearch: React.FC<ToolbarActionsSearchProps> = ({
  role,
  user,
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

  return (
    <div className="flex">
      {NotificationPanelComponent && (
        <Button onClick={handleToggleAside}>
          <CircleNotificationsIcon
            sx={{
              color: colors.brown600,
            }}
          />
        </Button>
      )}
      {NotificationPanelComponent && (
        <NotificationPanelComponent
          onClose={handleToggleAside}
          visibility={handleAside ? "visible" : "hidden"}
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
