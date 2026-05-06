import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/api';

export default function WilayahScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('provinsi');
    const [dataProvinsi, setDataProvinsi] = useState([]);
    const [dataKabko, setDataKabko] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'provinsi') {
                const res = await api.get('/provinsi');
                setDataProvinsi(res.data);
            } else {
                const res = await api.get('/kabko');
                setDataKabko(res.data);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal menarik data wilayah dari server.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [activeTab])
    );

    const handleDeleteProvinsi = (id) => {
        Alert.alert('Konfirmasi', 'Yakin ingin menghapus provinsi ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/provinsi/${id}`);
                        fetchData();
                    } catch (error) {
                        Alert.alert(
                            'Gagal',
                            'Tidak bisa menghapus provinsi. Pastikan tidak ada data Kab/Kota atau Peserta yang masih terhubung.'
                        );
                    }
                },
            },
        ]);
    };

    const handleDeleteKabko = (id) => {
        Alert.alert('Konfirmasi', 'Yakin ingin menghapus Kab/Kota ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/kabko/${id}`);
                        fetchData();
                    } catch (error) {
                        Alert.alert(
                            'Gagal',
                            'Tidak bisa menghapus. Pastikan tidak ada peserta yang terhubung ke Kab/Kota ini.'
                        );
                    }
                },
            },
        ]);
    };

    const renderProvinsi = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="map-outline" size={20} color="#2563EB" />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.nama}</Text>
                    <Text style={styles.secondaryText}>Provinsi</Text>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.btn, styles.btnEdit]}
                    onPress={() => navigation.navigate('ProvinsiForm', { id: item.id })}
                >
                    <Ionicons name="pencil" size={14} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, styles.btnDelete]}
                    onPress={() => handleDeleteProvinsi(item.id)}
                >
                    <Ionicons name="trash" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderKabko = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="business-outline" size={20} color="#7C3AED" />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.nama}</Text>
                    <Text style={styles.secondaryText}>
                        {item.nama_provinsi || 'Tanpa Provinsi'}
                    </Text>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.btn, styles.btnEdit]}
                    onPress={() => navigation.navigate('KabkoForm', { id: item.id })}
                >
                    <Ionicons name="pencil" size={14} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, styles.btnDelete]}
                    onPress={() => handleDeleteKabko(item.id)}
                >
                    <Ionicons name="trash" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setSearchQuery('');
    };

    const filteredProvinsi = dataProvinsi.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredKabko = dataKabko.filter(
        (item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.nama_provinsi &&
                item.nama_provinsi.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <View style={styles.container}>
            {/* ── Custom Tab Switcher ── */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'provinsi' && styles.tabActive]}
                    onPress={() => handleTabSwitch('provinsi')}
                >
                    <Ionicons
                        name={activeTab === 'provinsi' ? 'map' : 'map-outline'}
                        size={16}
                        color={activeTab === 'provinsi' ? '#2563EB' : '#6B7280'}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'provinsi' && styles.tabTextActive,
                        ]}
                    >
                        Provinsi
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'kabko' && styles.tabActive]}
                    onPress={() => handleTabSwitch('kabko')}
                >
                    <Ionicons
                        name={activeTab === 'kabko' ? 'business' : 'business-outline'}
                        size={16}
                        color={activeTab === 'kabko' ? '#2563EB' : '#6B7280'}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'kabko' && styles.tabTextActive,
                        ]}
                    >
                        Kab/Kota
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Search Bar ── */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder={
                        activeTab === 'provinsi'
                            ? 'Cari nama provinsi...'
                            : 'Cari kab/kota atau provinsi...'
                    }
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9CA3AF"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* ── List ── */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <FlatList
                    data={activeTab === 'provinsi' ? filteredProvinsi : filteredKabko}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={activeTab === 'provinsi' ? renderProvinsi : renderKabko}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name={
                                    activeTab === 'provinsi'
                                        ? 'map-outline'
                                        : 'business-outline'
                                }
                                size={60}
                                color="#D1D5DB"
                            />
                            <Text style={styles.emptyText}>Belum ada data.</Text>
                        </View>
                    }
                />
            )}

            {/* ── FAB ── */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    if (activeTab === 'provinsi') {
                        navigation.navigate('ProvinsiForm');
                    } else {
                        navigation.navigate('KabkoForm');
                    }
                }}
            >
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Tab
    tabContainer: {
        flexDirection: 'row',
        margin: 16,
        marginBottom: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 4,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#2563EB',
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 11,
        fontSize: 14,
        color: '#111827',
    },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: { flex: 1 },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
    },
    secondaryText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 8,
    },
    btn: {
        width: 34,
        height: 34,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnEdit: { backgroundColor: '#F59E0B' },
    btnDelete: { backgroundColor: '#EF4444' },

    // Empty
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        gap: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 15,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#2563EB',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#2563EB',
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
});