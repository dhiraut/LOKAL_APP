import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { Entypo, FontAwesome, MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment'; // You'll need to install moment.js

export default function JobDetails() {
  const { job } = useLocalSearchParams();
  const jobData = typeof job === 'string' ? JSON.parse(job) : job;

  // Style variables from API or defaults
  const primaryColor = jobData.job_tags?.[0]?.bg_color || '#E7F3FE';
  const textColor = jobData.job_tags?.[0]?.text_color || '#0E56A8';
  const secondaryColor = '#F8FAFC';

  const handleWhatsAppPress = () => {
    if (jobData.whatsapp_no) {
      Linking.openURL(`https://wa.me/${jobData.whatsapp_no}`);
    }
  };

  // Format date using moment.js
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('MMM D, YYYY') : 'Not specified';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: secondaryColor }]}>
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: primaryColor }]}>
        <ThemedText type="title" style={[styles.companyTitle, { color: textColor }]}>
          {jobData.company_name || 'Company Name'}
        </ThemedText>
        <View style={styles.locationRow}>
          <Entypo name="location-pin" size={18} color={textColor} />
          <ThemedText style={[styles.locationText, { color: textColor }]}>
            {jobData.primary_details?.Place || 'Location Not Specified'}
          </ThemedText>
        </View>
        
        {/* Job Title Badge */}
        <View style={[styles.jobTitleBadge, { backgroundColor: textColor }]}>
          <Text style={[styles.jobTitleText, { color: primaryColor }]}>
            {jobData.title}
          </Text>
        </View>
      </View>

      {/* Basic Info Card */}
      <View style={styles.detailsCard}>
        {/* Salary */}
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={22} color="#4CAF50" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Salary</Text>
            <Text style={styles.detailValue}>
              {jobData.primary_details?.Salary === '-' 
                ? 'Not Specified' 
                : jobData.primary_details?.Salary}
            </Text>
          </View>
        </View>

        {/* Experience */}
        {jobData.experience && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="briefcase-clock" size={22} color="#6366F1" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Experience</Text>
              <Text style={styles.detailValue}>{jobData.primary_details.Experience}</Text>
            </View>
          </View>
        )}

        {/* Qualification */}
        {jobData.qualification && (
          <View style={styles.detailRow}>
            <Ionicons name="school" size={22} color="#EC4899" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Qualification</Text>
              <Text style={styles.detailValue}>{jobData.primary_details.Qualification}</Text>
            </View>
          </View>
        )}

        {/* Job Hours */}
        {jobData.job_hours && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-time-eight" size={22} color="#F59E0B" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Job Hours</Text>
              <Text style={styles.detailValue}>{jobData.job_hours}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Contact Card */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Contact Information</Text>
        
        <TouchableOpacity 
          style={styles.contactItem} 
          onPress={handleWhatsAppPress}
        >
          <FontAwesome name="whatsapp" size={24} color="#25D366" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={styles.contactValue}>
              {jobData.whatsapp_no || 'Not provided'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
        </TouchableOpacity>
      </View>

        <View style={styles.detailsCard}>
        {/* Other Details */}
        {jobData.other_details && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Additional Details</Text>
            </View>
            <Text style={styles.sectionText}>{jobData.other_details || "Not Available"}</Text>
          </View>
        )}
      </View>

      {/* Timing Card */}
      {(jobData.prefered_call_start_time || jobData.prefered_call_end_time) && (
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Preferred Contact Times</Text>
          
          {jobData.prefered_call_start_time && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-start" size={22} color="#10B981" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Call Start Time</Text>
                <Text style={styles.detailValue}>{jobData.prefered_call_start_time}</Text>
              </View>
            </View>
          )}

          {jobData.prefered_call_end_time && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-end" size={22} color="#EF4444" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Call End Time</Text>
                <Text style={styles.detailValue}>{jobData.prefered_call_end_time}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Dates Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Job Timeline</Text>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="date-range" size={22} color="#6366F1" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Posted On</Text>
            <Text style={styles.detailValue}>{formatDate(jobData.created_on)}</Text>
          </View>
        </View>

        {jobData.expire_on && (
          <View style={styles.detailRow}>
            <MaterialIcons name="event-busy" size={22} color="#EF4444" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Expires On</Text>
              <Text style={styles.detailValue}>{formatDate(jobData.expire_on)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Tags Card */}
      {jobData.job_tags?.length > 0 && (
        <View style={styles.tagsCard}>
          <Text style={styles.tagsTitle}>Job Tags</Text>
          <View style={styles.tagsContainer}>
            {jobData.job_tags.map((tag, index) => (
              <View 
                key={index} 
                style={[
                  styles.tag, 
                  { 
                    backgroundColor: tag.bg_color || '#E7F3FE',
                  }
                ]}
              >
                <Text style={{ 
                  color: tag.text_color || '#0E56A8',
                  fontSize: 12,
                  fontWeight: '500'
                }}>
                  {tag.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tagsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  companyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '500',
  },
  jobTitleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  jobTitleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    paddingLeft: 28, // Align with icon
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});