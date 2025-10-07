import { forwardRef, useState } from "react";
import { TextInput, ActionIcon, Box } from "@mantine/core";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Field } from "./field";
import { InputGroup } from "./input-group";

export interface PasswordInputProps {
  rootProps?: React.ComponentProps<typeof Box>;
  startElement?: React.ReactNode;
  errors?: any;
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode };
  defaultVisible?: boolean;
  [key: string]: any; // extra props for TextInput
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      rootProps,
      defaultVisible,
      visibilityIcon = { on: <FiEye />, off: <FiEyeOff /> },
      startElement,
      errors,
      ...rest
    },
    ref
  ) {
    const [visible, setVisible] = useState(defaultVisible || false);

    const toggleVisible = () => setVisible((v: boolean) => !v);

    return (
      <Field errorText={errors?.[rest.name]?.message}>
        <InputGroup
          startElement={startElement}
          endElement={
            <ActionIcon onClick={toggleVisible} tabIndex={-1}>
              {visible ? visibilityIcon.off : visibilityIcon.on}
            </ActionIcon>
          }
          {...rootProps}
        >
          <TextInput
            {...rest} // value, onChange, onBlur, name from RHF
            ref={ref} // forward RHF ref safely
            type={visible ? "text" : "password"}
            variant="default"
            styles={{ input: { paddingRight: 42 } }}
          />
        </InputGroup>
      </Field>
    );
  }
);
