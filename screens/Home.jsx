import { StatusBar } from 'expo-status-bar';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment-timezone'
import React, { useState, useEffect } from 'react';

import AlarmClock from '../components/Clock';
import { styles, textStyles } from '../styles/styles'; // Adjust the path as needed

export default function Home({ isDarkMode }) {
  // Accept isDarkMode as a prop

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState(moment.tz.guess());
  const [screenClock, setScreenClock] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const timeZones = moment.tz.names();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const addNewTimeZone = (zone) =>{
    if (!screenClock.includes(zone)){
      setScreenClock([...screenClock, zone]);
    }
  }

  const removeTimeZone = (index) => {
    setScreenClock(screenClock => screenClock.filter((_, i) => i !== index));
  };

  const showTimeZonePicker = () => {
    setModalVisible(!modalVisible);
  };

  // Define dynamic styles based on isDarkMode
  const dynamicStyles = {
    backgroundColor: isDarkMode ? 'darkgrey' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <Text style={{ ...textStyles.titleText, padding: 20, color: dynamicStyles.color }}>
        Alarm Clock
      </Text>

      <View style={[styles.box, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <Text style={{ ...styles.time, color: dynamicStyles.color }}>
          {currentTime.toLocaleTimeString()}
        </Text>
      </View>

      <AlarmClock style={{ marginTop: 100, padding: 100, paddingTop: 100 }} />
    
      <View style={{ height: 10 }} />
      {/* Managing picker for the time zones */}
      <View>
        <TouchableOpacity onPress={() =>{
          showTimeZonePicker();
          if (modalVisible) {
            addNewTimeZone(selectedTimeZone); // Add the selected time zone
          }        
        }} 
        style={styles.button}>
          <Text style={textStyles.buttonText}>
            {modalVisible ? "Confirm Clock" : "Add New World Clock"}
          </Text>
        </TouchableOpacity>     
        {modalVisible && (
          <Picker
            style={styles.picker}
            selectedValue={selectedTimeZone}
            onValueChange={(itemValue) => {
              setSelectedTimeZone(itemValue);
            }}
          >
          {timeZones.map((zone) => (
            <Picker.Item key = {zone} label = {zone} value = {zone}/>
          ))}
          </Picker>
        )}     
      </View>

      <View>
        {screenClock.map((zone, index) => (
          <View key={index} style={[styles.time, { backgroundColor: dynamicStyles.backgroundColor }]}>
            <Text style={{ ...styles.buttonText, color: dynamicStyles.color }}>
              {zone}
            </Text>
            <TouchableOpacity onPress={() => removeTimeZone(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <View style={[styles.box, { backgroundColor: dynamicStyles.backgroundColor }]}>
              <Text style={{ ...styles.time, color: dynamicStyles.color }}>
                {moment().tz(zone).format('hh:mm:ss A')}
              </Text>
            </View>
          </View>
        ))}
      </View>


      <StatusBar style={{ marginTop: 500 }} />
    </ScrollView>
  );
};
