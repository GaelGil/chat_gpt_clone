"use client";

import { toaster } from "@/components/ui/toaster";

const useCustomToast = () => {
  const showSuccessToast = (message: string) => {
    toaster.show({
      title: "Success!",
      message,
      color: "green",
    });
  };

  const showErrorToast = (message: string) => {
    toaster.show({
      title: "Something went wrong!",
      message,
      color: "red",
    });
  };

  return { showSuccessToast, showErrorToast };
};

export default useCustomToast;
