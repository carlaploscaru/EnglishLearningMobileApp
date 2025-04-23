import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://xbq4gmvb0e.execute-api.eu-central-1.amazonaws.com/UserDetails/settings';

export default function UserDetails() {
  const [userData, setUserData] = useState(null);//get
  const [loading, setLoading] = useState(true);//get

  const [editMode, setEditMode] = useState(false);//put
  const [updatedName, setUpdatedName] = useState('');//put
  const [updatedBirthdate, setUpdatedBirthdate] = useState('');//put

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { userId } = await getCurrentUser();
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        const response = await fetch(`${API_URL}?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'AuthorizationPusDeMine': `Bearer ${idToken}`,
          },
        });

        const raw = await response.json();
        const data = typeof raw.body === 'string' ? JSON.parse(raw.body) : raw;

        setUserData(data);
        setUpdatedName(data.name);
        setUpdatedBirthdate(data.birthdate);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);



  
  const handleSave = async () => {
    try {
      const { userId } = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const response = await fetch(`${API_URL}?user_id=${userId}&name=${updatedName}&birthdate=${updatedBirthdate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'AuthorizationPusDeMine': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.status}`);
      }

      const result = await response.json();
      const updated = typeof result.body === 'string' ? JSON.parse(result.body) : result;

      setUserData(updated.updatedUser);
      setEditMode(false);
      Alert.alert('Success', 'User details updated.');
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update user details.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  if (!userData) {
    return <Text style={styles.error}>User data could not be loaded.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email: {userData.email}</Text>
      <Text style={styles.label}>Level: {userData.current_level}</Text>
      <Text style={styles.label}>XP: {userData.current_xp}</Text>

      {editMode ? (
        <>
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={updatedName} onChangeText={setUpdatedName} />

          <Text style={styles.label}>Birthdate:</Text>
          <TextInput style={styles.input} value={updatedBirthdate} onChangeText={setUpdatedBirthdate} />
        </>
      ) : (
        <>
          <Text style={[styles.label, styles.underline]}>Name: {userData.name}</Text>
          <Text style={[styles.label, styles.underline]}>Birthdate: {userData.birthdate}</Text>
        </>
      )}

      

      <View style={{ marginTop: 20, padding:70 }}>
        <Button 
          title={editMode ? 'Save' : 'Edit'}
          color={editMode ? 'blue' : 'green'} 
          onPress={editMode ? handleSave : () => setEditMode(true)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  loading: {
    marginTop: 100,
  },
  error: {
    marginTop: 100,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  underline: {
    backgroundColor:"#BEBEBE",
    borderRadius: 3
  },
});
