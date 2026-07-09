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

interface TableData {
  type: 'table';
  headers: string[];
  rows: string[][];
}

type ParagraphContent = string | TableData;

interface MateriContent {
  heading: string;
  image: any;
  paragraphs: ParagraphContent[];
}

const MATERI_CONTENTS: Record<number, MateriContent> = {
  1: {
    heading: "Apa Iku\nUnggah-unggah\nbasa?",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "Sapa ta sing klebu \"wong tuwa\" iku? Ing tatanan kabudayan Jawa, wong tuwa iku ora mung bapak lan ibu sing wis ngukir jiwa raga utawa nglairake awake dhewe ing omah. Wong tuwa yaiku kabeh priyayi sing yuswane luwih sepuh, utawa sing pantes diurmati amarga kalungguhane. Iki kalebu simbah, pakdhe, budhe, bapak lan ibu guru ing pamulangan, sarta tangga teparo ing lingkungan masarakat sing luwih sepuh. Ngurmati wong tuwa dadi dhasar tatanan moral lan budi pekerti ing urip bebrayan.",
      "Kenangapa awake dhewe kudu ngajeni wong tuwa? Wong sing luwih sepuh iku wis luwih dhisik ngrasakake pait getire urip. Wawasane luwih jembar lan pengalamane luwih akeh tinimbang bocah enom. Sikap ngajeni iki didhasarake dudu amarga awake dhewe wedi, nanging minangka wujud rasa panuwun, bakti, lan pakurmatan marang tuntunan sarta katresnane. Ing filosofi Jawa, bocah sing pinter ing sekolah nanging ora bisa ngajeni wong tuwa, asring diarani bocah sing \"kurang trapsila\" utawa durung ngerti tata krama.",
      "Wujud pakurmatan sing paling gampang dideleng yaiku lumantar basa sing diucapake nalika guneman. Yen matur utawa omongan karo wong sing luwih tuwa, awake dhewe wajib nggunakake Basa Krama Alus utawa Krama Inggil. Basa Krama Alus nduweni tetembungan sing alus, ngemu surasa andhap asor utawa ngasorake dhiri pribadi, sarta ngluhurake wong sing diajak omongan. Contone sing paling prasaja, nalika ditimbali ora pareng mangsuli nganggo tembung \"Apa\" utawa \"Heh\", nanging kudu mangsuli kanthi sopan, kayata \"Dalem\" utawa \"Kula\". Semono uga nalika arep budhal sekolah, kudu nyuwun pamit kanthi ukara sing bener, kayata: \"Pak, Bu, kula nyuwun pamit badhe bidhal sekolah, nyuwun pangestunipun.\"",
      "Saliyane tatanan basa, solah bawa utawa tingkah laku ugi kudu tansah dijaga. Basa sing alus kudu dibarengi karo tumindak sing sopan. Tuladhane, nalika mlaku ngliwati wong tuwa sing lagi lungguh, awake dhewe kudu rada mbungkukake awak sinambi ngucap, \"Nuwun sewu, ndherek langkung.\" Yen arep nuding utawa nuduhake arah, ora pareng nggunakake driji panuding, nanging luwih sopan yen nggunakake jempol tangan tengen. Sarta, nalika wong tuwa lagi ngendikan, awake dhewe kudu meneng, ngrungokake kanthi tenanan, lan ora pareng medhot omongane.",
      "Mula saka iku, ayo padha mbiasakake nggunakake unggah-ungguh basa lan tata krama ing urip padinan. Ora usah isin utawa wedi luput nalika nyoba matur nganggo basa Krama. Wong tuwa mesthi bakal maklumi lan malah seneng banget yen ngerti ana bocah enom sing gelem ngleluri sarta ngetrapake budaya jawane. Ngajeni wong tuwa iku wujud nyata karakter lan kapribaden sing luhur."
    ]
  },
  2: {
    heading: "Basa\nKrama Inggil\n(Alus)",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "A. Pengertian\nBasa krama inggil yaiku tingkatan basa Jawa kang luwih sopan.\nDigunakake kanggo:\n• guru\n• wong tuwa\n• tamu\n• kepala sekolah\n• tokoh masyarakat\n• lan wong sing diurmati.",
      "B. Tujuan Panganggone\n1. Kurmat marang wong kang diajak ngomong.\n2. Nduduhake sipat kang luwih sopan.\n3. Njaga etika masyarakat Jawa.",
      "C. Ciri-Ciri\n1. Nggunakake tetembungan kang alus.\n2. Luwih sopan.\n3. Biasane digunakake ing adicara kang resmi.",
      "D. Tuladha Tembung Krama Inggil",
      {
        type: 'table',
        headers: ['Ngoko', 'Krama Inggil'],
        rows: [
          ['Mangan', 'Dhahar'],
          ['Turu', 'Sare'],
          ['Omong', 'Ngendika'],
          ['Mlaku', 'Tindak'],
          ['Mulih', 'Kondur']
        ]
      },
      "E. Tuladhane Ukara\n1. \"Bapak sampun dhahar dereng?\"\n2. \"Panjenengan badhé tindak pundi?\"\n3. \"Ibu guru sampun rawuh.\""
    ]
  },
  3: {
    heading: "Basa\nKrama Madya\n(Lugu)",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "A. Pengertian\nBasa krama madya yaiku tingkatan basa sing luwih sopan dibanding ngoko nanging durung paling alus.\nDigunakake kanggo:\n• wong sing durung akrab\n• tetangga\n• utawa wong sing luwih tua.",
      "B. Ciri-Ciri\n1. Luwih sopan.\n2. Digunakake ing situasi semi formal.\n3. Campuran antarane ngoko lan krama alus.",
      "C. Tuladha",
      {
        type: 'table',
        headers: ['Bahasa Indonesia', 'Krama Madya'],
        rows: [
          ['Saya mau pergi', 'Kula badhé tindak'],
          ['Anda dari mana?', 'Sampeyan saking pundi?'],
          ['Sudah makan?', 'Sampun nedha?']
        ]
      },
      "D. Tuladhane Ukara\n1. \"Kula badhé dhateng pasar.\"\n2. \"Sampeyan badhé tindak pundi?\"\n3. \"Mangga pinarak rumiyin.\""
    ]
  },
  4: {
    heading: "Basa Ngoko",
    image: require('../../assets/materi_assets/materi_character.png'),
    paragraphs: [
      "A. Pengertian Basa Ngoko\nBasa ngoko yaiku basa Jawa sing paling sederhana lan santai.\nBiasane digunakake kanggo:\n• kanca sebaya\n• adhik\n• wong sing wis akrab\n• utawa wong sing umure luwih enom.",
      "B. Ciri-Ciri Basa Ngoko\n1. Tembungé sederhana.\n2. Ora resmi.\n3. Digunakake ing suasana santai.\n4. Ora terlalu memperhatikan kesopanan tingkat tinggi.",
      "C. Tuladha Basa Ngoko",
      {
        type: 'table',
        headers: ['Bahasa Indonesia', 'Basa Ngoko'],
        rows: [
          ['Saya makan', 'Aku mangan'],
          ['Kamu tidur', 'Kowe turu'],
          ['Mau pergi ke mana?', 'Arep menyang ngendi?'],
          ['Sudah mandi?', 'Wis adus?']
        ]
      },
      "D. Tuladhane Ukara\n1. \"Aku arep dolan.\"\n2. \"Kowe wis mangan durung?\"\n3. \"Ayo menyang sekolah bareng.\""
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

          {/* Parchment Content Card at the bottom */}
          <ImageBackground
            source={require('../../assets/texture/texture3.png')}
            style={localStyles.contentCard}
            imageStyle={localStyles.contentCardImage}
            resizeMode="cover"
          >
            {content.paragraphs.map((p, idx) => {
              if (typeof p === 'string') {
                return (
                  <Text key={idx} style={localStyles.paragraphText}>
                    {p}
                  </Text>
                );
              } else if (p.type === 'table') {
                return (
                  <View key={idx} style={localStyles.tableContainer}>
                    <View style={[localStyles.tableRow, localStyles.tableHeader]}>
                      {p.headers.map((h, hIdx) => (
                        <Text key={`h-${hIdx}`} style={[localStyles.tableCell, localStyles.tableHeaderText]}>{h}</Text>
                      ))}
                    </View>
                    {p.rows.map((row, rIdx) => (
                      <View key={`r-${rIdx}`} style={localStyles.tableRow}>
                        {row.map((cell, cIdx) => (
                          <Text key={`c-${cIdx}`} style={localStyles.tableCell}>{cell}</Text>
                        ))}
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })}
          </ImageBackground>

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
    overflow: 'hidden',
    borderRadius: 28,
    padding: rs(28, 32, 36),
    paddingTop: rs(36, 40, 44),
    paddingBottom: rs(36, 40, 44),
    marginHorizontal: vw(5),
    marginBottom: vh(5),
    ...Platform.select({
      ios: {
        shadowColor: '#6B3F1D',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  contentCardImage: {
    borderRadius: 28,
    transform: [{ scale: 1.8 }],
  },
  paragraphText: {
    color: '#3B1E08',
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Regular',
    lineHeight: scaleFont(rs(18, 20, 22)),
    marginBottom: 16,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#6B3F1D',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#6B3F1D',
  },
  tableHeader: {
    backgroundColor: 'rgba(107, 63, 29, 0.15)',
  },
  tableCell: {
    flex: 1,
    padding: rs(6, 8, 10),
    color: '#3B1E08',
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Regular',
    borderRightWidth: 1,
    borderRightColor: '#6B3F1D',
  },
  tableHeaderText: {
    fontFamily: 'Poppins-Bold',
  },
});
