import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  
} from 'react-native';

import styles from '../../styles/materi/MateriStyles';
import { rs, scaleFont, vw, vh } from '../../utils/responsive';
import BackButton from '../BackButton';

interface MateriDetailScreenProps {
  nodeId: number;
  title: string;
  onBack: () => void;
}

interface MateriContent {
  heading: string;
  image: any;
  paragraphs: string[];
}

const MATERI_CONTENTS: Record<number, MateriContent> = {
  1: {
    heading: "Apa Iku\nUnggah-unggah\nbasa?",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "Sapa ta sing klebu \"wong tuwa\" iku? Ing tatanan kabudayan Jawa, wong tuwa iku ora mung bapak lan ibu sing wis ngukir jiwa raga utawa nglairake awake dhewe ing omah. Wong tuwa yaiku kabeh priyayi sing yuswane luwih sepuh, utawa sing pantes diurmati amarga kalungguhane.",
      "Iki kalebu simbah, pakdhe, budhe, bapak lan ibu guru ing pamulangan, sarta tangga teparo ing lingkungan masarakat sing luwih sepuh. Ngurmati wong tuwa dadi dhasar tatanan moral lan budi pekerti ing urip bebrayan.",
      "Kenangapa awake dhewe kudu ngajeni wong tuwa? Wong sing luwih sepuh iku wis luwih dhisik ngrasakake pait getire urip. Wawasane luwih jembar lan pengalamane luwih akeh tinimbang bocah enom. Sikap ngajeni iki didhasarake dudu amarga awake dhewe wedi, nanging minangka wujud rasa panuwun, bakti, lan pakurmatan marang tuntunan sarta katresnane. Ing filosofi Jawa, bocah sing pinter ing sekolah nanging ora bisa ngajeni wong tuwa iku dianggep kurang asor budine."
    ]
  },
  2: {
    heading: "Basa\nKrama Inggil\n(Alus)",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "Basa Krama Inggil utawa Krama Alus yaiku tingkatan basa Jawa sing paling dhuwur lan paling alus. Basa iki digunakake khusus kanggo ngajeni wong sing luwih sepuh utawa wong sing pantes diurmati.",
      "Tuladha panggunaane yaiku nalika anak matur marang wong tuwa, murid matur marang bapak/ibu guru, utawa nalika kita ngomongake wong liya sing luwih dhuwur drajate.",
      "Ing ngisor iki tuladha tembung Krama Inggil:\n• Mangan -> Dhahar\n• Turu -> Sare\n• Teka -> Rawuh\n• Lungguh -> Pinarak\n\nTuladha ukara: 'Bapak nembe kemawon rawuh saking kantor banjur dhahar sega goreng.'"
    ]
  },
  3: {
    heading: "Basa\nKrama Madya\n(Lugu)",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "Basa Krama Madya utawa Krama Lugu yaiku basa krama sing tingkatane ana ing tengah-tengah. Basa iki luwih alus tinimbang Ngoko, nanging ora saalus Krama Inggil.",
      "Basa iki biasane digunakake dening wong sing padha-padha diurmati nanging wis akrab (kayata kanca padha kanca), utawa wong tuwa marang wong enom sing isih diurmati.",
      "Ing ngisor iki tuladha tembung Krama Madya:\n• Lunga -> Kesah\n• Mangan -> Nedha\n• Turu -> Tilem\n• Kowe -> Sampeyan\n\nTuladha ukara: 'Sampeyan wau kesah dhateng peken mundhut nopo?'"
    ]
  },
  4: {
    heading: "Basa Ngoko\nSaben Dina\n(Lugu & Alus)",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "Basa Ngoko yaiku tingkatan basa sing paling dasar ing basa Jawa. Basa iki nduweni sifat santai, akrab, lan biasa digunakake saben dina.",
      "Basa Ngoko Lugu digunakake kanggo ngomong karo kanca sing wis akrab banget, wong tuwa marang anak/putu, utawa nalika guneman dhewe (batin).",
      "Ing ngisor iki tuladha tembung Ngoko:\n• Lunga -> Lunga\n• Mangan -> Mangan\n• Turu -> Turu\n• Kowe -> Kowe\n\nTuladha ukara: 'Kowe opo wis mangan awan iki? Ayo dolan bareng.'"
    ]
  }
};

export default function MateriDetailScreen({ nodeId, title, onBack }: MateriDetailScreenProps) {
  const content = MATERI_CONTENTS[nodeId] || {
    heading: title,
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: ["Materi pasinaon mboten saged dipunpanggihaken."]
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Custom Header with Back Button (returns to roadmap list) */}
          <View style={styles.header}>
            <BackButton onPress={onBack} />
            <Image source={require('../../assets/title_board/materi.png')} style={{ width: 140, height: 45 }} resizeMode="contain" />
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Large Left-Aligned Heading */}
          <Text style={localStyles.materiHeading}>{content.heading}</Text>

          {/* Character illustration (Shrimp and Milkfish) */}
          <View style={localStyles.characterContainer}>
            <Image
              source={content.image}
              style={localStyles.characterImg}
              resizeMode="contain"
            />
          </View>

          {/* White Content Card at the bottom */}
          <View style={localStyles.contentCard}>
            {content.paragraphs.map((p, idx) => (
              <Text key={idx} style={localStyles.paragraphText}>
                {p}
              </Text>
            ))}
          </View>

        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const localStyles = StyleSheet.create({
  materiHeading: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(26, 28, 30)),
    fontFamily: 'Poppins-Bold',
    paddingHorizontal: vw(8),
    marginTop: vh(2),
    lineHeight: scaleFont(rs(34, 38, 40)),
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: vh(1.5),
  },
  characterImg: {
    width: rs(220, 240, 260),
    height: rs(180, 200, 220),
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginHorizontal: vw(5),
    marginBottom: vh(5),
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  paragraphText: {
    color: '#334155', // Slate-700
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Regular',
    lineHeight: scaleFont(rs(18, 20, 22)),
    marginBottom: 16,
  },
});
