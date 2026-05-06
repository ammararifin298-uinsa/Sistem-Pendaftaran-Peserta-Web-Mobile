import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api, { getFotoUrl } from '../../api/api';

export default function PesertaListScreen({ navigation }) {
    const [peserta, setPeserta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPeserta = async () => {
        setLoading(true);
        try {
            const response = await api.get('/peserta');
            setPeserta(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengambil data dari server. Cek koneksi API Anda.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPeserta();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert('Konfirmasi', 'Yakin ingin menghapus peserta ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/peserta/${id}`);
                        fetchPeserta();
                    } catch (error) {
                        Alert.alert('Error', 'Gagal menghapus data.');
                    }
                },
            },
        ]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PesertaDetail', { id: item.id })}
            activeOpacity={0.7}
        >
            {/* ── Foto Thumbnail ── */}
            <Image
                source={
                    item.pas_foto
                        ? { uri: getFotoUrl(item.pas_foto) }
                        : {
                            uri:
                                'https://ui-avatars.com/api/?name=' +
                                encodeURIComponent(item.nama) +
                                '&background=2563EB&color=fff&size=128',
                        }
                }
                style={styles.avatar}
            />

            {/* ── Info Peserta ── */}
            <View style={styles.cardInfo}>
                <Text style={styles.name} numberOfLines={1}>{item.nama}</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="male-female-outline" size={13} color="#6B7280" />
                    <Text style={styles.infoText}>
                        {item.jk == 1 ? 'Laki-laki' : 'Perempuan'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={13} color="#6B7280" />
                    <Text style={styles.infoText}>
                        {formatDate(item.tanggallahir)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={13} color="#6B7280" />
                    <Text style={styles.infoText} numberOfLines={1}>
                        {item.nama_kabko || '-'}, {item.nama_provinsi || '-'}
                    </Text>
                </View>
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.btn, styles.btnEdit]}
                    onPress={() => navigation.navigate('PesertaForm', { id: item.id })}
                >
                    <Ionicons name="pencil" size={14} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, styles.btnDelete]}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={{ marginTop: 10, color: '#6B7280' }}>Memuat Data...</Text>
            </View>
        );
    }

    const filteredPeserta = peserta.filter(
        (item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.nama_kabko &&
                item.nama_kabko.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.nama_provinsi &&
                item.nama_provinsi.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <View style={styles.container}>
            {/* ── Search Bar ── */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari nama, kab/kota, atau provinsi..."
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
            <FlatList
                data={filteredPeserta}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={60} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Belum ada data peserta.</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
            />

            {/* ── FAB ── */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('PesertaForm')}
            >
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
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
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
        gap: 3,
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
    },

    // Action Buttons
    actionButtons: {
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

    // Empty State
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