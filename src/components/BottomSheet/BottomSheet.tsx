import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Colors from "@/src/constants/Colors";

interface BottomSheetModalComponentProps {
  children: ReactNode;
}

const BottomSheetModalComponent = forwardRef<
  BottomSheetModal,
  BottomSheetModalComponentProps
>(({ children }, ref) => {
  const snapPoints = useMemo(() => ["35%"], []);

  // Renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.card}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card },
  indicator: { backgroundColor: "#FFF" },
  content: { flex: 1 },
});

export default BottomSheetModalComponent;
