import { SiteSettings } from "@/src/types";
import {
  FormLabel,
  VStack,
  FormControl,
  Input,
  Switch,
  FormHelperText,
  HStack,
} from "@chakra-ui/react";

interface SettingItem {
  key: string;
  value: string | null;
  encrypted: boolean;
  enabled: boolean;
  canEncrypt: boolean;
}

export function MiscPanel({
  settings,
  handleInputChange,
}: {
  settings: SettingItem[];
  handleInputChange: (key: string, value: string) => void;
}) {
  return (
    <VStack spacing={6} align="stretch">
      {settings.map((setting) => (
        <FormControl key={setting.key}>
          <HStack justify="space-between" align="center">
            <FormLabel mb={0}>{setting.key}</FormLabel>
            <Switch
              isChecked={setting.enabled}
              onChange={(e) =>
                handleInputChange(
                  `${setting.key}_enabled`,
                  e.target.checked.toString()
                )
              }
            />
          </HStack>

          <Input
            value={setting.value || ""}
            type={setting.encrypted ? "password" : "text"}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            isDisabled={!setting.enabled}
          />

          {setting.canEncrypt && (
            <FormHelperText>
              This field can be encrypted for additional security
            </FormHelperText>
          )}
        </FormControl>
      ))}
    </VStack>
  );
}
