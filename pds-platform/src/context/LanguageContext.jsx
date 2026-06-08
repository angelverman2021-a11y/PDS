import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    home: 'Home', shops: 'Shops', verify: 'Verify', report: 'Report',
    dashboard: 'Dashboard', allocation: 'Allocation', receipts: 'Receipts',
    complaints: 'Complaints', diary: 'Ration Diary', shopFinder: 'Shop Finder',
    verifyQR: 'Verify QR', login: 'Login', logout: 'Logout',
    findRationShops: 'Find Ration Shops',
    browseShops: 'Browse all registered shops or enter a pincode to find shops near you.',
    searchPlaceholder: 'Search by area or shop name…',
    pincodePlaceholder: 'Pincode',
    search: 'Search',
    allShops: 'All Shops', available: 'Available', lowStock: 'Low Stock', outOfStock: 'Out of Stock',
    shopsFound: 'shops found',
    viewDetails: 'View Details',
    welcomeBack: 'Welcome back',
    rationCard: 'Ration Card',
    familySize: 'Family Size',
    district: 'District',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    noActivity: 'No recent activity yet.',
  },
  hi: {
    home: 'होम', shops: 'दुकानें', verify: 'सत्यापित', report: 'रिपोर्ट',
    dashboard: 'डैशबोर्ड', allocation: 'आवंटन', receipts: 'रसीदें',
    complaints: 'शिकायतें', diary: 'राशन डायरी', shopFinder: 'दुकान खोजें',
    verifyQR: 'QR सत्यापित', login: 'लॉगिन', logout: 'लॉगआउट',
    findRationShops: 'राशन दुकानें खोजें',
    browseShops: 'सभी पंजीकृत दुकानें देखें या अपने पास की दुकानें खोजने के लिए पिनकोड दर्ज करें।',
    searchPlaceholder: 'क्षेत्र या दुकान के नाम से खोजें…',
    pincodePlaceholder: 'पिनकोड',
    search: 'खोजें',
    allShops: 'सभी दुकानें', available: 'उपलब्ध', lowStock: 'कम स्टॉक', outOfStock: 'स्टॉक खत्म',
    shopsFound: 'दुकानें मिलीं',
    viewDetails: 'विवरण देखें',
    welcomeBack: 'वापस स्वागत है',
    rationCard: 'राशन कार्ड',
    familySize: 'परिवार का आकार',
    district: 'जिला',
    quickActions: 'त्वरित क्रियाएं',
    recentActivity: 'हाल की गतिविधि',
    noActivity: 'अभी तक कोई गतिविधि नहीं।',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang][key] ?? translations.en[key] ?? key;
  const toggle = () => setLang(l => l === 'en' ? 'hi' : 'en');
  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
