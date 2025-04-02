import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView, 
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo, FontAwesome } from '@expo/vector-icons';

const BOOKMARKS_KEY = 'saved_job_bookmarks';

export default function Bookmarks() {
  const navigation = useNavigation();
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
        if (savedBookmarks) {
          const bookmarksObj = JSON.parse(savedBookmarks);
          setBookmarkedJobs(Object.values(bookmarksObj));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
    const unsubscribe = navigation.addListener('focus', loadBookmarks);
    return unsubscribe;
  }, [navigation]);

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job: JSON.stringify(job) });
  };

  const removeBookmark = async (jobId) => {
    try {
      const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (savedBookmarks) {
        let bookmarksObj = JSON.parse(savedBookmarks);
        delete bookmarksObj[jobId]; 
        await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarksObj));
        setBookmarkedJobs(Object.values(bookmarksObj));
        Alert.alert('Removed', 'Job removed from bookmarks');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Bookmarked Jobs</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : bookmarkedJobs.length === 0 ? (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>No bookmarked jobs</Text>
        </View>
      ) : (
        bookmarkedJobs.map((job, index) => {
          return (
            <View key={index} style={styles.jobContainer}> 
              <TouchableOpacity onPress={() => handleJobPress(job)}>
                <Text style={styles.title}>{job.title}</Text>
                <View style={styles.row}>
                  <Entypo name="location-pin" size={20} color="#2b2b2b" />
                  <Text style={styles.infoText}>{job.primary_details?.Place}</Text>
                </View>
                <View style={styles.row}>
                  <Entypo name="wallet" size={17} color="#2b2b2b" />
                  <Text style={styles.infoText}>{job.primary_details?.Salary === '-' ? 'Not Specified' : job.primary_details?.Salary}</Text>
                </View>
                <View style={styles.row}>
                  <FontAwesome name="whatsapp" size={17} color="#25D366" />
                  <Text style={styles.infoText}>{job.whatsapp_no}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeBookmark(job.id)}>
                <Text style={styles.removeButtonText}>Remove Bookmark</Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginBottom: 16,
    marginTop: 30,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  jobContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
    color: '#2b2b2b',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  noJobsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    marginTop: 16,
  },
  noJobsText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});