import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for dummy icons
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header / Profile Info */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            {/* Dummy profile icon instead of a profile image */}
            <Ionicons
              name="person-circle-outline"
              size={50}
              color="#fff"
              style={styles.profileIcon}
            />
            <Text style={styles.userName}>Ghulam Quadri</Text>
          </View>
          
          {/* Mood Section */}
          <TouchableOpacity style={styles.moodButton}>
            <Text style={styles.moodButtonText}>Set mood</Text>
            <Text style={styles.moodEmoji}>😊</Text>
          </TouchableOpacity>
        </View>

        {/* Friends */}
        <View style={styles.friendsContainer}>
          <View style={styles.friendsTitleRow}>
            <Text style={styles.friendsTitle}>6 Friends</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.friendsAvatars}>
            {/* Dummy friend icons */}
            <Ionicons name="person" size={40} color="#fff" style={styles.friendIcon} />
            <Ionicons name="person" size={40} color="#fff" style={styles.friendIcon} />
            <Ionicons name="person" size={40} color="#fff" style={styles.friendIcon} />
            <Ionicons name="person" size={40} color="#fff" style={styles.friendIcon} />
            <Ionicons name="person" size={40} color="#fff" style={styles.friendIcon} />
            <Ionicons name="person" size={40} color="#fff" style={styles.friendIcon} />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>16 days</Text>
            <Text style={styles.statLabel}>Current streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Entries this year</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>9,029</Text>
            <Text style={styles.statLabel}>Words Written</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Account info</Text>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Notifications</Text>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Language</Text>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Account Info</Text>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// -----------------
//      STYLES
// -----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1b22'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    backgroundColor: '#2a2933',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  profileIcon: {
    marginRight: 12
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b3946',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  moodButtonText: {
    color: '#fff',
    marginRight: 8
  },
  moodEmoji: {
    fontSize: 18
  },
  friendsContainer: {
    backgroundColor: '#2a2933',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  friendsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  friendsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  seeAllText: {
    color: '#9b9a9e'
  },
  friendsAvatars: {
    flexDirection: 'row'
  },
  friendIcon: {
    marginRight: 8
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2a2933',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  statLabel: {
    color: '#9b9a9e',
    fontSize: 12,
    marginTop: 4
  },
  settingsContainer: {
    backgroundColor: '#2a2933',
    borderRadius: 12
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#3b3946',
    borderBottomWidth: 1
  },
  settingsItemText: {
    color: '#fff',
    fontSize: 16
  },
  settingsItemArrow: {
    color: '#9b9a9e',
    fontSize: 16
  }
});
