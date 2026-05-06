import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// ─── Screens Dashboard ───────────────────────────────────────────
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';

// ─── Screens Wilayah ─────────────────────────────────────────────
import WilayahScreen from './src/screens/Wilayah/WilayahScreen';
import ProvinsiFormScreen from './src/screens/Wilayah/ProvinsiFormScreen';
import KabkoFormScreen from './src/screens/Wilayah/KabkoFormScreen';

// ─── Screens Peserta ─────────────────────────────────────────────
import PesertaListScreen from './src/screens/Peserta/PesertaListScreen';
import PesertaFormScreen from './src/screens/Peserta/PesertaFormScreen';
import PesertaDetailScreen from './src/screens/Peserta/PesertaDetailScreen';

const Tab = createBottomTabNavigator();
const WilayahStack = createNativeStackNavigator();
const PesertaStack = createNativeStackNavigator();

// ─── Stack Wilayah ───────────────────────────────────────────────
function WilayahStackNavigator() {
    return (
        <WilayahStack.Navigator>
            <WilayahStack.Screen
                name="WilayahList"
                component={WilayahScreen}
                options={{ title: 'Data Wilayah' }}
            />
            <WilayahStack.Screen
                name="ProvinsiForm"
                component={ProvinsiFormScreen}
                options={({ route }) => ({
                    title: route.params?.id ? 'Edit Provinsi' : 'Tambah Provinsi',
                })}
            />
            <WilayahStack.Screen
                name="KabkoForm"
                component={KabkoFormScreen}
                options={({ route }) => ({
                    title: route.params?.id ? 'Edit Kab/Kota' : 'Tambah Kab/Kota',
                })}
            />
        </WilayahStack.Navigator>
    );
}

// ─── Stack Peserta ───────────────────────────────────────────────
function PesertaStackNavigator() {
    return (
        <PesertaStack.Navigator>
            <PesertaStack.Screen
                name="PesertaList"
                component={PesertaListScreen}
                options={{ title: 'Data Peserta' }}
            />
            <PesertaStack.Screen
                name="PesertaForm"
                component={PesertaFormScreen}
                options={({ route }) => ({
                    title: route.params?.id ? 'Edit Peserta' : 'Tambah Peserta',
                })}
            />
            <PesertaStack.Screen
                name="PesertaDetail"
                component={PesertaDetailScreen}
                options={{ title: 'Detail Peserta' }}
            />
        </PesertaStack.Navigator>
    );
}

// ─── Bottom Tab ──────────────────────────────────────────────────
export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#2563EB',
                    tabBarInactiveTintColor: '#9CA3AF',
                    tabBarStyle: {
                        paddingBottom: 5,
                        paddingTop: 5,
                        height: 60,
                        backgroundColor: '#FFFFFF',
                        borderTopColor: '#E5E7EB',
                        elevation: 10,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Dashboard') {
                            iconName = focused ? 'grid' : 'grid-outline';
                        } else if (route.name === 'Peserta') {
                            iconName = focused ? 'people' : 'people-outline';
                        } else if (route.name === 'Wilayah') {
                            iconName = focused ? 'map' : 'map-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        headerShown: true,
                        title: 'Dashboard',
                        headerStyle: { backgroundColor: '#2563EB' },
                        headerTintColor: '#FFFFFF',
                        headerTitleStyle: { fontWeight: 'bold' },
                    }}
                />
                <Tab.Screen
                    name="Peserta"
                    component={PesertaStackNavigator}
                    options={{ title: 'Peserta' }}
                />
                <Tab.Screen
                    name="Wilayah"
                    component={WilayahStackNavigator}
                    options={{ title: 'Wilayah' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}