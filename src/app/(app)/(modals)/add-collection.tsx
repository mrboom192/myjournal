import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/src/contexts/UserContext';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddCollectionScreen = () => {
  const router = useRouter();
  const { data } = useUser();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('journal-outline');
  const [color, setColor] = useState('#9C27B0');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      const db = getFirestore();
      await addDoc(collection(db, "collections"), {
        name: name.trim(),
        icon,
        color,
        userId: data.uid,
        createdAt: serverTimestamp(),
      });
      
      router.back();
    } catch (error) {
      console.error("Error adding collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconOptions = [
    { name: 'journal-outline', color: '#9C27B0' },
    { name: 'leaf-outline', color: '#4CAF50' },
    { name: 'airplane-outline', color: '#2196F3' },
    { name: 'restaurant-outline', color: '#FF5722' },
    { name: 'heart-outline', color: '#E91E63' },
    { name: 'fitness-outline', color: '#FF9800' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'New Collection',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.form}>
        <Text style={styles.label}>Collection Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter collection name..."
          placeholderTextColor="#9b9a9e"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Choose Icon</Text>
        <View style={styles.iconGrid}>
          {iconOptions.map((option) => (
            <TouchableOpacity
              key={option.name}
              style={[
                styles.iconOption,
                icon === option.name && { borderColor: option.color }
              ]}
              onPress={() => {
                setIcon(option.name);
                setColor(option.color);
              }}
            >
              <View 
                style={[
                  styles.iconContainer, 
                  { backgroundColor: `${option.color}20` }
                ]}
              >
                <Ionicons name={option.name} size={24} color={option.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!name.trim() || isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Saving...' : 'Create Collection'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1b22',
    padding: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#2a2933',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  iconOption: {
    width: '30%',
    margin: '1.5%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    padding: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddCollectionScreen; 