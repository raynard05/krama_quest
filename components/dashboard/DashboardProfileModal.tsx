import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LogOut, X } from 'lucide-react-native';
import type { UserAccount } from '../../services/AuthService';
import styles from '../../styles/dashboard/DashboardProfileStyles';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface DashboardProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export default function DashboardProfileModal({
  visible,
  onClose,
  currentUser,
  onLogout,
}: DashboardProfileModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Profil Panjenengan</Text>
            <SoundTouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#1C1C1E" size={24} />
            </SoundTouchableOpacity>
          </View>

          <View style={styles.profileDetailsCard}>
            <Image
              source={require('../../assets/dashboard_assets/usericon2.png')}
              style={styles.largeAvatar}
            />
            <Text style={styles.profileName}>{currentUser?.nama_lengkap || 'Wafi'}</Text>
            <Text style={styles.profileUsername}>@{currentUser?.username || 'wafi'}</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kelas</Text>
              <Text style={styles.infoValue}>{currentUser?.kelas || '5-A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nomor Absen</Text>
              <Text style={styles.infoValue}>{currentUser?.nomor_absen || '12'}</Text>
            </View>
          </View>

          <SoundTouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              onClose();
              onLogout();
            }}
          >
            <LogOut color="#FFF" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Metu saka Akun</Text>
          </SoundTouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
