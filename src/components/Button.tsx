import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';

interface PrimaryButtonProps extends ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PrimaryButton = ({ label, onPress, loading, disabled, ...props }: PrimaryButtonProps) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={loading || disabled}
      {...props}
      style={[{ marginVertical: 8 }, props.style]}
    >
      {label}
    </Button>
  );
};

export const SecondaryButton = ({ label, onPress, loading, disabled, ...props }: PrimaryButtonProps) => {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      loading={loading}
      disabled={loading || disabled}
      {...props}
      style={[{ marginVertical: 8 }, props.style]}
    >
      {label}
    </Button>
  );
};
