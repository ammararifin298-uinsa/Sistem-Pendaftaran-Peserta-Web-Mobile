import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    Image,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api, { createPeserta, updatePeserta, getFotoUrl } from '../../api/api';

export default function PesertaFormScreen({ route, navigation }) {
    const [formData, setFormData] = useState({
        nama: '',
        tempatlahir: '',
        tanggallahir: '',
        agama: '',
        alamat: '',
        telepon: '',
        jk: '1',
        cita_cita: '',
        hobi: '',
        idkabko: '',
    });

    const [photoUri, setPhotoUri] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState(null);
    const [provinsiList, setProvinsiList] = useState([]);
    const [kabkoList, setKabkoList] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateValue, setDateValue] = useState(new Date());
    const [displayDate, setDisplayDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const id = route.params?.id;

    useEffect(() => {
        fetchProvinsiList();
        if (id) {
            setIsEdit(true);
            fetchPesertaDetail();
        }
    }, [id]);

    const fetchProvinsiList = async () => {
        try {
            const res = await api.get('/provinsi');
            setProvinsiList(res.data);
        } catch (error) {
            console.error('Gagal memuat provinsi:', error);
        }
    };

    const fetchKabkoByProv = async (idProv) => {
        if (!idProv) {
            setKabkoList([]);
            return;
        }
        try {
            const res = await api.get(`/kabko/provinsi/${idProv}`);
            setKabkoList(res.data);
        } catch (error) {
            console.error('Gagal memuat kabko:', error);
        }
    };

    const handleProvinsiChange = (itemValue) => {
        setSelectedProvinsi(itemValue);
        handleChange('idkabko', '');
        fetchKabkoByProv(itemValue);
    };

    const fetchPesertaDetail = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/peserta/${id}`);
            const data = response.data;

            if (data.tanggallahir) {
                const dateOnly = data.tanggallahir.split('T')[0];
                data.tanggallahir = dateOnly;
                const dDate = new Date(dateOnly);
                setDateValue(dDate);
                const d = dDate.getDate().toString().padStart(2, '0');
                const m = (dDate.getMonth() + 1).toString().padStart(2, '0');
                const y = dDate.getFullYear();
                setDisplayDate(`${d}/${m}/${y}`);
            }

            if (data.id_provinsi) {
                const idProvStr = data.id_provinsi.toString();
                setSelectedProvinsi(idProvStr);
                fetchKabkoByProv(idProvStr);
            }

            if (data.idkabko) data.idkabko = data.idkabko.toString();
            if (data.jk !== undefined) data.jk = data.jk.toString();
            if (data.pas_foto) setExistingPhoto(data.pas_foto);

            Object.keys(data).forEach((key) => {
                if (data[key] === null) data[key] = '';
            });

            setFormData(data);
        } catch (error) {
            Alert.alert('Error', 'Gagal mengambil data dari server.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setDateValue(selectedDate);
            const yyyy = selectedDate.getFullYear();
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            handleChange('tanggallahir', `${yyyy}-${mm}-${dd}`);
            setDisplayDate(`${dd}/${mm}/${yyyy}`);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!formData.nama.trim() || !formData.telepon.trim()) {
            Alert.alert('Validasi', 'Nama dan Telepon wajib diisi.');
            return;
        }

        setLoading(true);
        const submitData = new FormData();

        Object.keys(formData).forEach((key) => {
            if (
                formData[key] !== '' &&
                formData[key] !== null &&
                formData[key] !== undefined
            ) {
                submitData.append(key, formData[key]);
            }
        });

        if (photoUri) {
            const filename = photoUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            submitData.append('pas_foto', {
                uri:
                    Platform.OS === 'android'
                        ? photoUri
                        : photoUri.replace('file://', ''),
                name: filename,
                type,
            });
        }

        try {
            if (isEdit) {
                await updatePeserta(id, submitData);
                Alert.alert('Sukses', 'Data berhasil diperbarui.');
            } else {
                await createPeserta(submitData);
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
            {/* ── Foto Profil ── */}
            <View style={styles.photoContainer}>
                <Image
                    source={
                        photoUri
                            ? { uri: photoUri }
                            : existingPhoto
                                ? { uri: getFotoUrl(existingPhoto) }
                                : {
                                    uri:
                                        'https://ui-avatars.com/api/?name=' +
                                        encodeURIComponent(formData.nama || 'P') +
                                        '&background=E5E7EB&color=9CA3AF&size=256',
                                }
                    }
                    style={styles.avatar}
                />
                <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                    <Ionicons name="camera-outline" size={16} color="#4B5563" />
                    <Text style={styles.photoBtnText}>
                        {existingPhoto || photoUri ? 'Ganti Foto' : 'Pilih Foto'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Kartu Data Pribadi ── */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Data Pribadi</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nama Lengkap *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.nama}
                        onChangeText={(text) => handleChange('nama', text)}
                        placeholder="Contoh: Budi Santoso"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Tempat Lahir</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.tempatlahir}
                            onChangeText={(text) => handleChange('tempatlahir', text)}
                            placeholder="Kota Lahir"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Tanggal Lahir</Text>
                        <TouchableOpacity
                            style={styles.dateInputWrapper}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text
                                style={{
                                    color: displayDate ? '#111827' : '#9CA3AF',
                                    flex: 1,
                                    fontSize: 14,
                                }}
                            >
                                {displayDate || 'DD/MM/YYYY'}
                            </Text>
                            <Ionicons
                                name="calendar-outline"
                                size={18}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Agama</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.agama}
                            onValueChange={(itemValue) =>
                                handleChange('agama', itemValue)
                            }
                        >
                            <Picker.Item
                                label="-- Pilih Agama --"
                                value=""
                                color="#9CA3AF"
                            />
                            <Picker.Item label="Islam" value="Islam" />
                            <Picker.Item label="Kristen" value="Kristen" />
                            <Picker.Item label="Katolik" value="Katolik" />
                            <Picker.Item label="Hindu" value="Hindu" />
                            <Picker.Item label="Buddha" value="Buddha" />
                            <Picker.Item label="Konghucu" value="Konghucu" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Jenis Kelamin</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={[
                                styles.radioBtn,
                                formData.jk === '1' && styles.radioBtnActive,
                            ]}
                            onPress={() => handleChange('jk', '1')}
                        >
                            <Ionicons
                                name="male-outline"
                                size={16}
                                color={formData.jk === '1' ? '#2563EB' : '#6B7280'}
                            />
                            <Text
                                style={[
                                    styles.radioText,
                                    formData.jk === '1' && styles.radioTextActive,
                                ]}
                            >
                                Laki-laki
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.radioBtn,
                                formData.jk === '0' && styles.radioBtnActive,
                            ]}
                            onPress={() => handleChange('jk', '0')}
                        >
                            <Ionicons
                                name="female-outline"
                                size={16}
                                color={formData.jk === '0' ? '#2563EB' : '#6B7280'}
                            />
                            <Text
                                style={[
                                    styles.radioText,
                                    formData.jk === '0' && styles.radioTextActive,
                                ]}
                            >
                                Perempuan
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* ── Kartu Kontak dan Wilayah ── */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Kontak dan Wilayah</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nomor Telepon *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.telepon}
                        onChangeText={(text) => handleChange('telepon', text)}
                        keyboardType="phone-pad"
                        placeholder="08123456789"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Alamat Lengkap</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.alamat}
                        onChangeText={(text) => handleChange('alamat', text)}
                        multiline
                        placeholder="Jalan, RT/RW, Desa..."
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Pilih Provinsi</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedProvinsi}
                            onValueChange={handleProvinsiChange}
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
                    <Text style={styles.label}>Kabupaten / Kota</Text>
                    <View
                        style={[
                            styles.pickerContainer,
                            !selectedProvinsi && { backgroundColor: '#E5E7EB' },
                        ]}
                    >
                        <Picker
                            selectedValue={formData.idkabko}
                            onValueChange={(itemValue) =>
                                handleChange('idkabko', itemValue)
                            }
                            enabled={!!selectedProvinsi}
                        >
                            <Picker.Item
                                label="-- Pilih Kab/Kota --"
                                value=""
                                color="#9CA3AF"
                            />
                            {kabkoList.map((kab) => (
                                <Picker.Item
                                    key={kab.id}
                                    label={kab.nama}
                                    value={kab.id.toString()}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>

            {/* ── Kartu Lain-lain ── */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Lain-lain</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Cita-cita</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.cita_cita}
                        onChangeText={(text) => handleChange('cita_cita', text)}
                        placeholder="Contoh: Programmer"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Hobi</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.hobi}
                        onChangeText={(text) => handleChange('hobi', text)}
                        placeholder="Contoh: Membaca, Coding"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {/* ── Tombol Submit ── */}
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
                            {isEdit ? 'Update Data Peserta' : 'Simpan Data Peserta'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Foto
    photoContainer: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#D1D5DB',
        marginBottom: 12,
        backgroundColor: '#E5E7EB',
    },
    photoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    photoBtnText: { color: '#4B5563', fontWeight: '600', fontSize: 13 },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
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

    // Form
    formGroup: { marginBottom: 16 },
    row: { flexDirection: 'row' },
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
    dateInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },

    // Radio
    radioContainer: { flexDirection: 'row', gap: 10 },
    radioBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
    },
    radioBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
    radioText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    radioTextActive: { color: '#2563EB', fontWeight: 'bold' },

    // Submit
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#2563EB',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});