import { useState } from "react";
import RoleConfig from "../../utils/RoleConfig";
import { Button } from "@mui/material";
import { Account } from "@toolpad/core/Account";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { colors } from "../../utils/Constants";

type ToolbarActionsSearchProps = {
  role: string;
};

const ToolbarActionsSearch: React.FC<ToolbarActionsSearchProps> = ({
  role,
}) => {
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
      <Account />
    </div>
  );
};

export default ToolbarActionsSearch;
