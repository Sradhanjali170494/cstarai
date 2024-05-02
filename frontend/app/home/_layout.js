import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons, you can choose any other

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer  
       screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'events/index') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'attendees/index') {
            iconName = focused ? 'person' : 'person-outline';
          }  else if (route.name === 'sponsors/index') {
            iconName = focused ? 'person' : 'person-outline';
          }   else if (route.name === 'venues/index') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'registrations/index') {
            iconName = focused ? 'open' : 'open-outline';
          }  else if (route.name === 'reports/index') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'activity/index') {
            iconName = focused ? 'cloud' : 'cloud-outline';
          }  else if (route.name === 'settings/index') {
            iconName = focused ? 'settings' : 'settings-outline';
          }  else if (route.name === 'helpdesk/index') {
            iconName = focused ? 'help' : 'help-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard'
          }}
        />
        <Drawer.Screen
          name="events/index" 
          options={{
            drawerLabel: 'Events',
            title: 'All Events',
          }}
        />
        <Drawer.Screen
          name="events/add" 
          options={{
            title: 'New Event',
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="events/edit" 
          options={{
            title: 'Update Event',
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="attendees/index" 
          options={{
            drawerLabel: 'Attendees',
            title: 'All Attendees',
          }}
        />
        <Drawer.Screen
          name="attendees/add" 
          options={{
            title: 'New Attendee',
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="attendees/edit" 
          options={{
            title: 'Update Attendee',
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="sponsors/index" 
          options={{
            drawerLabel: 'Sponsors',
            title: 'All Sponsors',
          }}
        />
        <Drawer.Screen
          name="sponsors/add" 
          options={{
            title: 'New Sponsor',
            drawerItemStyle: { display: 'none' }
          }}
        />
         <Drawer.Screen
          name="sponsors/edit" 
          options={{
            title: 'Update Sponsor',
            drawerItemStyle: { display: 'none' }
          }}
        />
          <Drawer.Screen
          name="venues/index" 
          options={{
            drawerLabel: 'Venues',
            title: 'All Venues',
          }}
        />
        <Drawer.Screen
          name="venues/add" 
          options={{
            title: 'New Venue',
            drawerItemStyle: { display: 'none' }
          }}
        />
         <Drawer.Screen
          name="venues/edit" 
          options={{
            title: 'Update Venue',
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="registrations/index" 
          options={{
            drawerLabel: 'Registrations',
            title: 'All Registrations',
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="reports/index" 
          options={{
            drawerLabel: 'Reports',
            title: 'Reports',
          }}
        />
        <Drawer.Screen
          name="activity/index" 
          options={{
            drawerLabel: 'Activity',
            title: 'Activity',
          }}
        />
        <Drawer.Screen
          name="settings/index" 
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
        <Drawer.Screen
          name="helpdesk/index" 
          options={{
            drawerLabel: 'Help Desk',
            title: 'Help Desk',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}