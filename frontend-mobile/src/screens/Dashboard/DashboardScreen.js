import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDashboard } from '../../api/api';

export default function DashboardScreen() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboard = async () => {
        try {
            const res = await getDashboard();
            setData(res.data);
        } catch (err) {
            console.error('Gagal fetch dashboard:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboard();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.bg}
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* ── Header ── */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard Registrasi</Text>
                <Text style={styles.headerSub}>
                    Terhubung ke backend Node.js + PostgreSQL. Tarik ke bawah untuk
                    memperbarui statistik.
                </Text>
            </View>

            {/* ── Kartu Statistik ── */}
            <View style={styles.cardRow}>
                <View style={[styles.card, { borderTopColor: '#2563EB' }]}>
                    <Ionicons name="people" size={28} color="#2563EB" />
                    <Text style={[styles.cardValue, { color: '#2563EB' }]}>
                        {data?.total_peserta ?? 0}
                    </Text>
                    <Text style={styles.cardLabel}>TOTAL PESERTA</Text>
                </View>

                <View style={[styles.card, { borderTopColor: '#7C3AED' }]}>
                    <Ionicons name="business" size={28} color="#7C3AED" />
                    <Text style={[styles.cardValue, { color: '#7C3AED' }]}>
                        {data?.total_kabko ?? 0}
                    </Text>
                    <Text style={styles.cardLabel}>KAB / KOTA</Text>
                </View>

                <View style={[styles.card, { borderTopColor: '#16A34A' }]}>
                    <Ionicons name="map" size={28} color="#16A34A" />
                    <Text style={[styles.cardValue, { color: '#16A34A' }]}>
                        {data?.total_provinsi ?? 0}
                    </Text>
                    <Text style={styles.cardLabel}>PROVINSI</Text>
                </View>
            </View>

            {/* ── Info Box ── */}
            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Tentang Sistem</Text>
                <Text style={styles.infoText}>
                    Aplikasi ini dibangun dengan React Native Expo, terhubung ke
                    backend Node.js + Express.js dan database PostgreSQL.
                </Text>
            </View>

            <Text style={styles.footer}>
                Data diambil secara real-time dari API — tarik ke bawah untuk
                memperbarui statistik.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bg: {
        backgroundColor: '#F3F4F6',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#2563EB',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 6,
    },
    headerSub: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 16,
    },
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        borderTopWidth: 4,
        elevation: 2,
        gap: 6,
    },
    cardLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    cardValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    infoBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    footer: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 4,
    },
});