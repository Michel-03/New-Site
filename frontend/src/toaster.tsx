import { createToaster, Toast, Toaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
  duration: 7000,
  max: 3,
});

export function AppToaster() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root
          width={{ base: "calc(100vw - 32px)", md: "380px" }}
          bg="#1c1612"
          color="#fffaf5"
          borderRadius="16px"
          boxShadow="0 16px 40px rgba(28,22,18,0.22)"
          px="4"
          py="3"
        >
          <Toast.Title fontFamily="Fraunces, Georgia, serif" fontSize="lg" fontWeight="560">
            {toast.title}
          </Toast.Title>
          {toast.description ? (
            <Toast.Description color="rgba(255,250,245,0.82)" lineHeight="1.5">
              {toast.description}
            </Toast.Description>
          ) : null}
          <Toast.CloseTrigger color="#fffaf5" />
        </Toast.Root>
      )}
    </Toaster>
  );
}
