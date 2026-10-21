import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobOpenings, employmentTypes } from '../lib/siteData';

export default function JobsScreen() {
  const [titleQuery, setTitleQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [industryQuery, setIndustryQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('All');

  const jobs = useMemo(() => {
    return jobOpenings.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(titleQuery.toLowerCase());
      const matchesCountry = job.country.toLowerCase().includes(countryQuery.toLowerCase()) || job.location.toLowerCase().includes(countryQuery.toLowerCase());
      const matchesIndustry = job.industry.toLowerCase().includes(industryQuery.toLowerCase());
      const matchesType = employmentType === 'All' || job.employmentType === employmentType;
      return matchesTitle && matchesCountry && matchesIndustry && matchesType;
    });
  }, [titleQuery, countryQuery, industryQuery, employmentType]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Job Vacancies</Text>
        <Text style={styles.pageSubtitle}>Demo job listings only — sample postings for website preview.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterPanel}>
          <Text style={styles.label}>Job title</Text>
          <TextInput
            value={titleQuery}
            onChangeText={setTitleQuery}
            placeholder="Search by job title"
            style={styles.input}
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            value={countryQuery}
            onChangeText={setCountryQuery}
            placeholder="e.g. Nigeria or Remote"
            style={styles.input}
          />

          <Text style={styles.label}>Industry</Text>
          <TextInput
            value={industryQuery}
            onChangeText={setIndustryQuery}
            placeholder="e.g. Technology or Design"
            style={styles.input}
          />

          <Text style={styles.label}>Employment type</Text>
          <View style={styles.chipRow}>
            {employmentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, employmentType === type && styles.chipSelected]}
                onPress={() => setEmploymentType(type)}
              >
                <Text style={[styles.chipText, employmentType === type && styles.chipTextSelected]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={28} color="#94a3b8" />
            <Text style={styles.emptyText}>No matching vacancies found. Try different keywords.</Text>
          </View>
        ) : (
          jobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.companyName}>{job.company}</Text>
                </View>
                {job.isDemo && <Text style={styles.demoBadge}>Demo</Text>}
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.meta}><Ionicons name="location" size={13} color="#64748b" /> {job.location}</Text>
                <Text style={styles.meta}><Ionicons name="globe" size={13} color="#64748b" /> {job.country}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.meta}><Ionicons name="briefcase" size={13} color="#64748b" /> {job.industry}</Text>
                <Text style={styles.meta}><Ionicons name="time" size={13} color="#64748b" /> {job.employmentType}</Text>
              </View>

              <Text style={styles.description}>{job.description}</Text>

              <View style={styles.footerRow}>
                <Text style={styles.closing}>Closing date: {job.closingDate}</Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => Linking.openURL(job.link)}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0f172a',
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: '#cbd5e1',
    marginTop: 6,
    fontSize: 13,
  },
  content: {
    padding: 18,
    paddingBottom: 38,
  },
  filterPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  label: {
    color: '#334155',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  chipText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 12,
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  companyName: {
    marginTop: 4,
    color: '#475569',
    fontWeight: '600',
  },
  demoBadge: {
    backgroundColor: '#ede9fe',
    color: '#6d28d9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  meta: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    marginTop: 14,
    color: '#334155',
    lineHeight: 22,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  closing: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 12,
  },
  applyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  applyText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    marginTop: 10,
    color: '#475569',
    textAlign: 'center',
  },
});
