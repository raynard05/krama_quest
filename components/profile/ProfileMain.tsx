import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { UserAccount } from '../../services/AuthService';
import ProfileScreen from './ProfileScreen';
import HistoryScreen from './HistoryScreen';
import AvatarPickerScreen from './AvatarPickerScreen';
import BacksoundSettingsScreen from './BacksoundSettingsScreen';

interface ProfileMainProps {
  currentUser: (UserAccount & { avatarId?: string; avatarBgId?: string }) | null;
  onBack: () => void;
  onUpdateAvatar: (avatarId: string) => void;
  onUpdateAvatarBg: (avatarBgId: string) => void;
}

type SubScreen = 'main' | 'history' | 'avatar_picker' | 'backsound_settings';

export default function ProfileMain({
  currentUser,
  onBack,
  onUpdateAvatar,
  onUpdateAvatarBg
}: ProfileMainProps) {
  const [activeSubScreen, setActiveSubScreen] = useState<SubScreen>('main');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {activeSubScreen === 'main' && (
        <ProfileScreen
          currentUser={currentUser}
          onBack={onBack}
          onNavigateToHistory={() => setActiveSubScreen('history')}
          onEditAvatar={() => setActiveSubScreen('avatar_picker')}
          onNavigateToSettings={() => setActiveSubScreen('backsound_settings')}
        />
      )}

      {activeSubScreen === 'history' && (
        <HistoryScreen
          onBack={() => setActiveSubScreen('main')}
        />
      )}

      {activeSubScreen === 'avatar_picker' && (
        <AvatarPickerScreen
          initialAvatarId={currentUser?.avatarId}
          initialAvatarBgId={currentUser?.avatarBgId}
          onBack={() => setActiveSubScreen('main')}
          onSave={(avatarId) => {
            onUpdateAvatar(avatarId);
          }}
          onSaveBg={(avatarBgId) => {
            onUpdateAvatarBg(avatarBgId);
            setActiveSubScreen('main');
          }}
        />
      )}

      {activeSubScreen === 'backsound_settings' && (
        <BacksoundSettingsScreen
          onBack={() => setActiveSubScreen('main')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12', // Ensure solid background color matches the theme
  },
});
