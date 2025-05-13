import {
  FormControl,
  FormLabel,
  Input,
  Switch,
  HStack,
  FormHelperText,
  Text,
} from "@chakra-ui/react";

interface SettingFieldProps {
  setting: any;
  handleInputChange: (key: string, value: string) => void;
  handleToggle: (key: string) => void;
}

export const SettingField = ({
  setting,
  handleInputChange,
  handleToggle,
}: SettingFieldProps) => {
  return (
    <FormControl key={setting.key}>
      <FormLabel>{setting.name || setting.key}</FormLabel>
      {setting.hasOwnProperty("enabled") && (
        <HStack mb={1}>
          <Text>{setting.enabled ? "Enabled" : "Disabled"}</Text>
          <Switch
            isDisabled={!setting.value && setting.key !== "localPostAnalytics"}
            isChecked={setting.enabled}
            onChange={() => handleToggle(setting.key)}
          />
        </HStack>
      )}
      {setting.key !== "localPostAnalytics" && (
        <Input
          maxW={600}
          rounded="md"
          type={setting.encrypted ? "password" : "text"}
          value={setting.value || ""}
          onChange={(e) => handleInputChange(setting.key, e.target.value)}
          placeholder={setting.description}
        />
      )}
      {setting.description && (
        <FormHelperText>{setting.description}</FormHelperText>
      )}
    </FormControl>
  );
};
