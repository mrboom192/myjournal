import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const JournalEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get params if editing an existing entry
  const isEditMode = params.editMode === 'true';
  const paramTitle = params.title ? decodeURIComponent(params.title as string) : '';
  const paramContent = params.content ? decodeURIComponent(params.content as string) : '';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const currentDate = new Date();
  
  // Initialize with params data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setTitle(paramTitle);
      setContent(paramContent);
    }
  }, [isEditMode, paramTitle, paramContent]);
  
  const formattedDate = `Created on ${months[currentDate.getMonth()]} ${getOrdinalNum(currentDate.getDate())}, ${currentDate.getFullYear()}`;

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Save the journal entry logic would go here
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: false,
          presentation: 'modal',
        }} 
      />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>done</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#9b9a9e"
            value={title}
            onChangeText={setTitle}
          />
          
          <Text style={styles.dateText}>{formattedDate}</Text>
          
          <View style={styles.divider} />
          
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#9b9a9e"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper functions
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1b22',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  dateText: {
    color: '#9b9a9e',
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#3b3946',
    marginBottom: 16,
  },
  contentInput: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
  },
});

export default JournalEntryScreen; 