import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


const ChallengeTitle = () =>{
    const { title } = useLocalSearchParams(); //this gets the challenge title to show up on the new screen 
    const router = useRouter();

    return ( 
    <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
  
        {/* Display Challenge Title */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Complete this challenge and earn points!</Text>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingTop: 50,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 1,
      },

    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#660066",
      textAlign: "center",
    },

    subtitle: {
      fontSize: 16,
      color: "#555",
      marginTop: 10,
      textAlign: "center",
    },

  });
export default ChallengeTitle;

