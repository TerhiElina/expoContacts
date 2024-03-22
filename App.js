import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

export default function App() {
 
  const [contacts, setContacts] = useState([]);
  //Create asyncronous function where getContactsAsync function
  //gets all the contacts from the device
  //function returns an array of contact objects
  const getContacts = async () =>{
    const {status} = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const {data} = await Contacts.getContactsAsync (
        {fields : [Contacts.Fields.PhoneNumbers]}
      );
      if (data.length > 0){
        setContacts(data); // Tässä asetetaan kaikki yhteystiedot dataan
      }
    }
  }
  const sendSms = async (phoneNumber, contactName) =>{
    const isSmsAvailable = await SMS.isAvailableAsync();
    if (isSmsAvailable  && phoneNumber) {
      await SMS.sendSMSAsync(phoneNumber, 'Moi ' + contactName)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
      <Button
      title="Get Contact"
      onPress={getContacts} />
      </View>
      <FlatList
        style={styles.list}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem = {({item}) => (
          <View style={styles.listItemContainer}>
          <Text style={{marginRight:10}}>{item.name}</Text> 
             {item.phoneNumbers && item.phoneNumbers.length > 0 && (
              <Text style={{marginRight: 5}}>
                {item.phoneNumbers[0].number}
              </Text>
            )}
            <View style={{marginRight: 10}}>
            <Button
            title='Send SMS'
            onPress={() => sendSms(item.phoneNumbers[0].number, item.name)} />
          </View>
          </View>
      )}
      />
    <StatusBar style="auto" />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  list:{
    marginTop: '10%',
    marginLeft: '10%',
  

  },
  buttonContainer: {
    width: 200,
    alignItems:'flex-start',
    marginTop: '20%',
    marginLeft: '10%',
  },
  listItemContainer: {
    flexDirection:'row',
    padding: 5,
    fontSize:15,
},
});
