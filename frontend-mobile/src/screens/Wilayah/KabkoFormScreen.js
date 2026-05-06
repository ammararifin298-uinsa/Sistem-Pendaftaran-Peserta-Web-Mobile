import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/api';

export default function KabkoFormScreen({ route, navigation }) {
    const [nama, setNama] = useState('');
    const [idProvinsi, setIdProvinsi] = useState('');
    const [provinsiList, setProvinsiList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const id = route.params?.id;

    useEffect(() => {
        fetchProvinsiList();
        if (id) {
            setIsEdit(true);
            fetchKabkoDetail();
        }
    }, [id]);

    const fetchProvinsiList = async () => {
        try {
            const response = await api.get('/provinsi');
            setProvinsiList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchKabkoDetail = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/kabko/${id}`);
            setNama(response.data.nama);
            setIdProvinsi(response.data.id_provinsi.toString());
        } catch (error) {
            Alert.alert('Error', 'Gagal mengambil data dari server.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!nama.trim() || !idProvinsi) {
            Alert.alert('Validasi', 'Nama Kab/Kota dan Provinsi wajib diisi.');
            return;
        }
        setLoading(true);
        const payload = {
            nama: nama,
            id_provinsi: parseInt(idProvinsi),
        };
        try {
            if (isEdit) {
                await api.put(`/kabko/${id}`, payload);
                Alert.alert('Sukses', 'Data berhasil diperbarui.');
            } else {
                await api.post('/kabko', payload);
                Alert.alert('Sukses', 'Data baru berhasil ditambahkan.');
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal menyimpan data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Data Kabupaten / Kota</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Pilih Provinsi *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={idProvinsi}
                            onValueChange={(itemValue) => setIdProvinsi(itemValue)}
                        >
                            <Picker.Item
                                label="-- Pilih Provinsi --"
                                value=""
                                color="#9CA3AF"
                            />
                            {provinsiList.map((prov) => (
                                <Picker.Item
                                    key={prov.id}
                                    label={prov.nama}
                                    value={prov.id.toString()}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nama Kabupaten / Kota *</Text>
                    <TextInput
                        style={styles.input}
                        value={nama}
                        onChangeText={setNama}
                        placeholder="Contoh: Kota Surabaya"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons
                                name={isEdit ? 'save-outline' : 'add-circle-outline'}
                                size={20}
                                color="#fff"
                            />
                            <Text style={styles.submitBtnText}>
                                {isEdit ? 'Update Kab/Kota' : 'Simpan Kab/Kota'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 8,
    },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        backgroundColor: '#F9FAFB',
        color: '#111827',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        padding: 15,
        borderRadius: 8,
        elevation: 2,
    },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});