"use client";

import React from "react";
import { observer } from "mobx-react";
// hooks
import { TInstanceAuthenticationMethodKeys } from "@plane/types";
import { ToggleSwitch } from "@plane/ui";
import { useInstance } from "@/hooks/store";
// ui
// types

type Props = {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
};

export const PasswordLoginConfiguration: React.FC<Props> = observer((props) => {
  const { disabled, updateConfig } = props;
  // store
  const { formattedConfig } = useInstance();
  // derived values
  const enableEmailPassword = formattedConfig?.ENABLE_EMAIL_PASSWORD ?? "";
  const isPasswordEnabled = Boolean(parseInt(enableEmailPassword));

  return (
    <ToggleSwitch
      value={isPasswordEnabled}
      onChange={() => {
        updateConfig("ENABLE_EMAIL_PASSWORD", isPasswordEnabled ? "0" : "1");
      }}
      size="sm"
      disabled={disabled}
    />
  );
});
