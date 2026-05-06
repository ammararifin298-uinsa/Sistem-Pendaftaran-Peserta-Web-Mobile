import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api, { getFotoUrl } from '../../api/api';
import { useNavigation } from '@react-navigation/native';

export default function PesertaDetailScreen({ route }) {
    const { id } = route.params;
    const [peserta, setPeserta] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/peserta/${id}`);
                setPeserta(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!peserta) {
        return (
            <View style={styles.center}>
                <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                <Text style={styles.errorText}>Data peserta tidak ditemukan.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* ── Header Profile ── */}
            <View style={styles.headerProfile}>
                <Image
                    source={
                        peserta.pas_foto
                            ? { uri: getFotoUrl(peserta.pas_foto) }
                            : {
                                uri:
                                    'https://ui-avatars.com/api/?name=' +
                                    encodeURIComponent(peserta.nama) +
                                    '&background=2563EB&color=fff&size=256',
                            }
                    }
                    style={styles.avatar}
                />
                <Text style={styles.name}>{peserta.nama}</Text>

                {/* ── BAGIAN YANG DIUBAH: Menggunakan badgeColumn agar turun ke bawah ── */}
                <View style={styles.badgeColumn}>
                    <View style={styles.badge}>
                        <Ionicons
                            name={peserta.jk == 1 ? 'male' : 'female'}
                            size={14}
                            color="#1D4ED8"
                        />
                        <Text style={styles.badgeText}>
                            {peserta.jk == 1 ? 'Laki-laki' : 'Perempuan'}
                        </Text>
                    </View>
                    {peserta.agama ? (
                        <View style={[styles.badge, { backgroundColor: '#F0FDF4', }]}>
                            <Text style={[styles.badgeText, { color: '#16A34A' }]}>
                                {peserta.agama}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* ── Informasi Kontak ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informasi Kontak</Text>
                <View style={styles.card}>
                    <InfoRow
                        icon="call-outline"
                        label="Telepon"
                        value={peserta.telepon || '-'}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="home-outline"
                        label="Alamat"
                        value={peserta.alamat || '-'}
                    />
                </View>
            </View>

            {/* ── Data Pribadi ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Pribadi</Text>
                <View style={styles.card}>
                    <InfoRow
                        icon="location-outline"
                        label="Tempat Lahir"
                        value={peserta.tempatlahir || '-'}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="calendar-outline"
                        label="Tanggal Lahir"
                        value={formatDate(peserta.tanggallahir)}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="book-outline"
                        label="Agama"
                        value={peserta.agama || '-'}
                    />
                </View>
            </View>

            {/* ── Minat dan Wilayah ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minat dan Wilayah</Text>
                <View style={styles.card}>
                    <InfoRow
                        icon="star-outline"
                        label="Cita-cita"
                        value={peserta.cita_cita || '-'}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="color-palette-outline"
                        label="Hobi"
                        value={peserta.hobi || '-'}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="business-outline"
                        label="Kab/Kota"
                        value={peserta.nama_kabko || '-'}
                    />
                    <View style={styles.divider} />
                    <InfoRow
                        icon="map-outline"
                        label="Provinsi"
                        value={peserta.nama_provinsi || '-'}
                    />
                </View>
            </View>

            {/* ── Tombol Edit ── */}
            <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('PesertaForm', { id: peserta.id })}
            >
                <Ionicons name="pencil" size={18} color="#FFFFFF" />
                <Text style={styles.editBtnText}>Edit Data Peserta</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// ── Komponen InfoRow ──────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
    <View style={styles.row}>
        <View style={styles.iconWrapper}>
            <Ionicons name={icon} size={20} color="#2563EB" />
        </View>
        <View style={styles.rowData}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    errorText: { fontSize: 16, color: '#DC2626' },

    // Header Profile
    headerProfile: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        marginBottom: 24,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#2563EB',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },

    // ── BAGIAN YANG DIUBAH: badgeColumn menggantikan badgeRow ──
    badgeColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#1D4ED8',
        fontSize: 13,
        fontWeight: '600',
    },

    // Section
    section: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },

    // InfoRow
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowData: { flex: 1 },
    label: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    value: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 8,
    },

    // Edit Button
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        marginHorizontal: 16,
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#2563EB',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    editBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});