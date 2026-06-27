export interface AvatarItem {
  id: string;
  source: any;
}

export const PROFILE_AVATARS: AvatarItem[] = [
  { id: '1', source: require('../../assets/profile-pic/1.webp') },
  { id: '2', source: require('../../assets/profile-pic/2.webp') },
  { id: '3', source: require('../../assets/profile-pic/3.webp') },
  { id: '4', source: require('../../assets/profile-pic/4.webp') },
  { id: '5', source: require('../../assets/profile-pic/5.webp') },
  { id: '6', source: require('../../assets/profile-pic/6.webp') },
  { id: '7', source: require('../../assets/profile-pic/7.webp') },
  { id: '8', source: require('../../assets/profile-pic/8.webp') },
  { id: '9', source: require('../../assets/profile-pic/9.webp') },
  { id: '10', source: require('../../assets/profile-pic/10.webp') },
  { id: '11', source: require('../../assets/profile-pic/11.webp') },
  { id: '12', source: require('../../assets/profile-pic/12.webp') },
  { id: '13', source: require('../../assets/profile-pic/13.webp') },
  { id: '14', source: require('../../assets/profile-pic/14.webp') },
  { id: '15', source: require('../../assets/profile-pic/15.webp') },
  { id: '16', source: require('../../assets/profile-pic/16.webp') },
  { id: '17', source: require('../../assets/profile-pic/17.webp') },
  { id: '18', source: require('../../assets/profile-pic/18.webp') },
  { id: '19', source: require('../../assets/profile-pic/19.webp') },
  { id: '20', source: require('../../assets/profile-pic/20.webp') },
  { id: '21', source: require('../../assets/profile-pic/21.webp') },
];

export function getAvatarSource(avatarId: string | undefined): any {
  if (!avatarId) {
    // Default fallback to avatar 1
    return PROFILE_AVATARS[0].source;
  }
  const found = PROFILE_AVATARS.find(a => a.id === avatarId);
  return found ? found.source : PROFILE_AVATARS[0].source;
}

export interface BatikItem {
  id: string;
  source: any;
  title: string;
}

export const PROFILE_BATIKS: BatikItem[] = [
  { id: '1', source: require('../../assets/splash_screen/1.webp'), title: 'Batik Pastel' },
  { id: '2', source: require('../../assets/splash_screen/2.webp'), title: 'Batik Blue-Violet' },
  { id: '3', source: require('../../assets/splash_screen/3.webp'), title: 'Batik Gold-Teal' },
  { id: '4', source: require('../../assets/splash_screen/4.webp'), title: 'Batik Pink-Blue' },
  { id: '5', source: require('../../assets/splash_screen/5.webp'), title: 'Batik Monokrom' },
];

export function getBatikSource(batikId: string | undefined): any {
  if (!batikId) {
    return PROFILE_BATIKS[0].source;
  }
  const found = PROFILE_BATIKS.find(b => b.id === batikId);
  return found ? found.source : PROFILE_BATIKS[0].source;
}
