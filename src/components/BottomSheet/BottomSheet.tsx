import React, { ReactElement, useCallback } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";

const BottomSheetModalComponent = ({
  children,
  ref,
}: {
  children: ReactElement;
  ref?: React.Ref<BottomSheetModal>;
}) => {
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheetModal ref={ref} onChange={handleSheetChanges}>
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
});

export default BottomSheetModalComponent;
