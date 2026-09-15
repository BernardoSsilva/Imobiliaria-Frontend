import { Label, ListBox, ListBoxItem, Select } from "@heroui/react";

type Option = {
  key: string;
  label: string;
};

type Props = {
  label: string;
  selectedKey: string;
  onSelectionChange: (key: string) => void;
  options: Option[];
};

export function FormSelect({ label, selectedKey, onSelectionChange, options }: Props) {
  return (
    <Select
      fullWidth
      selectedKey={selectedKey}
      onSelectionChange={(key) => onSelectionChange(String(key))}
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox items={options}>
          {(item) => <ListBoxItem id={item.key}>{item.label}</ListBoxItem>}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
