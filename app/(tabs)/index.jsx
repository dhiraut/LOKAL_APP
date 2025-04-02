import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';
const BOOKMARKS_KEY = 'saved_job_bookmarks';

export default function Jobs() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
        if (savedBookmarks) {
          setBookmarkedJobs(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setJobs(data.results || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (job) => {
    try {
      const newBookmarks = { ...bookmarkedJobs };
      
      if (newBookmarks[job.id]) {
        delete newBookmarks[job.id];
      } else {
        newBookmarks[job.id] = job;
      }
      
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      setBookmarkedJobs(newBookmarks);
      
    } catch (error) {
      console.error('Error saving bookmark:', error);
      Alert.alert('Error', 'Failed to save bookmark');
    }
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { 
      job: JSON.stringify(job) 
    });
  };

  const validJobs = jobs.filter(job => job.title && job.title.trim() !== '');

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={{ backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
  <Text style={styles.pageTitle}>Jobs</Text>
</View>


      {/* Job Listings */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : validJobs.length === 0 ? (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>No job listings available</Text>
        </View>
      ) : (
        validJobs.map((job, index) => {
          const isBookmarked = !!bookmarkedJobs[job.id];
          return (
            <TouchableOpacity
              key={index}
              style={styles.jobContainer}
              onPress={() => handleJobPress(job)}
            >
              <View style={styles.headerRow}>
                <Text style={styles.title}>{job.title}</Text>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleBookmark(job);
                  }}
                  style={styles.bookmarkButton}
                >
                  <MaterialIcons 
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                    size={24} 
                    color={isBookmarked ? '#FFD700' : '#000'} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <Entypo name="location-pin" size={20} color="#000" />
                <Text style={styles.infoText}>{job.primary_details?.Place}</Text>
              </View>
              <View style={styles.row}>
                <Entypo name="wallet" size={17} color="#000" />
                <Text style={styles.infoText}>{job.primary_details?.Salary === '-' ? 'Not Specified' : job.primary_details?.Salary}</Text>
              </View>
              <View style={styles.row}>
                <FontAwesome name="whatsapp" size={17} color="#25D366" />
                <Text style={styles.infoText}>{job.whatsapp_no}</Text>
              </View>
            </TouchableOpacity>
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
    backgroundColor: 'transparent',
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 0, // Remove extra spacing below
    width: '100%',
  },  
  pageTitle: {
    fontSize: 22, // Updated to match first snippet
    fontWeight: 'bold',
    color: '#000', // White text (kept as in second snippet)
  },
  jobContainer: {
    backgroundColor: '#F5F5F5', // Updated from first snippet
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
    color: '#2b2b2b', // Updated from first snippet
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  noJobsContainer: {
    padding: 20, // Updated to match first snippet
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EAF6', // Updated from first snippet
    borderRadius: 12,
    marginTop: 16, // Added from first snippet
  },
  noJobsText: {
    fontSize: 16,
    color: '#424242', // Updated from first snippet
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkButton: {
    padding: 4,
  },
});
