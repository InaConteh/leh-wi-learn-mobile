import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Button, Card, Appbar, ActivityIndicator } from 'react-native-paper';
import { useAppStore } from '@store/appStore';
import { supabase } from '@services/supabase';
import { authService } from '@services/auth';
import { ErrorBanner } from '@components/ErrorBanner';
import { PrimaryButton } from '@components/Button';

interface NFT {
  id: string;
  name: string;
  description: string;
  token_id: string;
  metadata: any;
}

export const ProfileScreen = ({ navigation }: any) => {
  const user = useAppStore((s) => s.user);
  const profile = useAppStore((s) => s.profile);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadNfts();
  }, [user]);

  const loadNfts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('skill_mints')
        .select('*')
        .eq('user_id', user.id);

      if (err) throw err;
      setNfts(data || []);
    } catch (err: any) {
      setError('Failed to load skill NFTs');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (err: any) {
      setError('Failed to sign out');
      setShowError(true);
    }
  };

  const renderNFTCard = ({ item }: any) => (
    <Card style={styles.nftCard}>
      <Card.Content>
        <Text style={styles.nftName}>{item.metadata?.name || 'Skill NFT'}</Text>
        <Text style={styles.nftDescription}>{item.metadata?.description}</Text>
        <Text style={styles.tokenId}>Token ID: {item.token_id}</Text>
        {item.metadata?.attributes && (
          <View style={styles.attributes}>
            {item.metadata.attributes.map((attr: any, idx: number) => (
              <Text key={idx} style={styles.attribute}>
                {attr.trait_type}: {attr.value}
              </Text>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <Text style={styles.email}>{profile?.email || 'User'}</Text>
            <Text style={styles.role}>Role: {profile?.role || 'user'}</Text>
            {profile?.walletAddress && (
              <Text style={styles.wallet}>
                Wallet: {profile.walletAddress.slice(0, 10)}...
              </Text>
            )}
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Skill NFTs</Text>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : nfts.length === 0 ? (
            <Text style={styles.empty}>No skill NFTs yet. Complete assessments to earn them!</Text>
          ) : (
            <FlatList
              data={nfts}
              renderItem={renderNFTCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.actionButtons}>
          <PrimaryButton label="Sign Out" onPress={handleSignOut} children={undefined} />
        </View>
      </ScrollView>

      <ErrorBanner
        message={error}
        visible={showError}
        onDismiss={() => setShowError(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileCard: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  wallet: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  empty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 24,
  },
  nftCard: {
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  nftName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  nftDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  tokenId: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  attributes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attribute: {
    fontSize: 11,
    color: '#555',
    marginBottom: 4,
  },
  actionButtons: {
    paddingBottom: 24,
  },
});
