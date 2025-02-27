// filepath: /home/aneesh/main-production/upcheck/app/(tabs)/settings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import { SafeAreaView, ScrollView, View, StyleSheet, Modal, Text, TouchableOpacity, Alert } from 'react-native';
import { List, Divider, Card, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from '../../src/locales/en.json';
import ta from '../../src/locales/ta.json';
import hi from '../../src/locales/hi.json';
import te from '../../src/locales/te.json';
import kn from '../../src/locales/kn.json';
import ml from '../../src/locales/ml.json';

const messages = {
  en,
  ta,
  hi,
  te,
  kn,
  ml,
};

const App = () => {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        setLocale(storedLang);
      } else {
        const languageTag = Localization.locale.split('-')[0];
        setLocale(languageTag);
      }
    };

    loadLanguagePreference();
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <SettingsScreen locale={locale} setLocale={setLocale} />
    </IntlProvider>
  );
};

const SettingsScreen = ({ locale, setLocale }) => {
  const intl = useIntl();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(locale);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        setCurrentLang(storedLang);
        setLocale(storedLang);
      } else {
        const languageTag = Localization.locale.split('-')[0];
        setLocale(languageTag);
        setCurrentLang(languageTag);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLocale(lang);
      setCurrentLang(lang);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const clearFarmDetails = useCallback(async () => {
    Alert.alert(
      intl.formatMessage({ id: 'clearFarmStorageConfirmationTitle' }),
      intl.formatMessage({ id: 'clearFarmStorageConfirmationMessage' }),
      [
        {
          text: intl.formatMessage({ id: 'cancel' }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({ id: 'okay' }),
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('farmDetails');
              Alert.alert(
                intl.formatMessage({ id: 'success' }),
                intl.formatMessage({ id: 'farmStorageCleared' })
              );
            } catch (error) {
              console.error('Failed to clear farm details:', error);
              Alert.alert(
                intl.formatMessage({ id: 'error' }),
                intl.formatMessage({ id: 'farmStorageClearFailed' })
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, []);

  const clearPondDetails = useCallback(async () => {
    Alert.alert(
      intl.formatMessage({ id: 'clearPondStorageConfirmationTitle' }),
      intl.formatMessage({ id: 'clearPondStorageConfirmationMessage' }),
      [
        {
          text: intl.formatMessage({ id: 'cancel' }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({ id: 'okay' }),
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('pondDetails');
              Alert.alert(
                intl.formatMessage({ id: 'success' }),
                intl.formatMessage({ id: 'pondStorageCleared' })
              );
            } catch (error) {
              console.error('Failed to clear pond details:', error);
              Alert.alert(
                intl.formatMessage({ id: 'error' }),
                intl.formatMessage({ id: 'pondStorageClearFailed' })
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, []);

  const clearUserDetails = useCallback(async () => {
    Alert.alert(
      intl.formatMessage({ id: 'clearUserStorageConfirmationTitle' }),
      intl.formatMessage({ id: 'clearUserStorageConfirmationMessage' }),
      [
        {
          text: intl.formatMessage({ id: 'cancel' }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({ id: 'okay' }),
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userDetails');
              Alert.alert(
                intl.formatMessage({ id: 'success' }),
                intl.formatMessage({ id: 'userStorageCleared' })
              );
            } catch (error) {
              console.error('Failed to clear user details:', error);
              Alert.alert(
                intl.formatMessage({ id: 'error' }),
                intl.formatMessage({ id: 'userStorageClearFailed' })
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, []);

  const options = [
    {
      title: intl.formatMessage({ id: 'my_profile' }),
      icon: 'account',
      onPress: () => router.push('profile'),
    },
    {
      title: intl.formatMessage({ id: 'my_account' }),
      icon: 'account-cog',
      onPress: () => alert(intl.formatMessage({ id: 'accountPressed' })),
    },
    {
      title: intl.formatMessage({ id: 'notifications' }),
      icon: 'bell',
      onPress: () => alert(intl.formatMessage({ id: 'notificationPressed' })),
    },
    {
      title: `${intl.formatMessage({
        id: 'language',
      })} (${currentLang.toUpperCase()})`,
      icon: 'translate',
      onPress: () => setModalVisible(true),
    },
    {
      title: intl.formatMessage({ id: 'clear_farm_storage' }),
      icon: 'database-remove',
      onPress: () => clearFarmDetails(),
    },
    {
      title: intl.formatMessage({ id: 'clear_pond_storage' }),
      icon: 'database-minus',
      onPress: () => clearPondDetails(),
    },
    {
      title: intl.formatMessage({ id: 'clear_user_storage' }),
      icon: 'backup-restore',
      onPress: () => clearUserDetails(),
    },
    {
      title: intl.formatMessage({ id: 'logout' }),
      icon: 'logout-variant',
      onPress: async () => {
        await clearUserDetails();
        router.replace('login');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.profileCard}>
          <Card.Title
            title={intl.formatMessage({ id: 'user_settings' })}
            subtitle={intl.formatMessage({ id: 'manage_your_preferences' })}
            left={(props) => <Avatar.Icon {...props} icon="cog" />}
          />
        </Card>

        <View style={styles.listContainer}>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              <List.Item
                title={option.title}
                left={(props) => <List.Icon {...props} icon={option.icon} />}
                onPress={option.onPress}
                style={styles.listItem}
              />
              <Divider />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {intl.formatMessage({ id: 'select_language' })}
            </Text>
            {[
              { lang: 'en', label: '🇬🇧 English' },
              { lang: 'ta', label: '🇮🇳 Tamil' },
              { lang: 'hi', label: '🇮🇳 Hindi' },
              { lang: 'te', label: '🇮🇳 Telugu' },
              { lang: 'kn', label: '🇮🇳 Kannada' },
              { lang: 'ml', label: '🇮🇳 Malayalam' },
            ].map(({ lang, label }) => (
              <TouchableOpacity
                key={lang}
                style={styles.langButton}
                onPress={() => changeLanguage(lang)}
              >
                <Text style={styles.langText}>{label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>
                {intl.formatMessage({ id: 'close' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, padding: 15 },
  profileCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 5,
  },
  listItem: { paddingVertical: 12 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  langButton: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  langText: { fontSize: 16 },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
});

export default App;