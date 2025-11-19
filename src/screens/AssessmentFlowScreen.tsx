import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, ActivityIndicator, Appbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '@store/appStore';
import { assessmentService, AssessmentRequest } from '@services/assessment';
import { ErrorBanner } from '@components/ErrorBanner';
import { PrimaryButton } from '@components/Button';

enum AssessmentStep {
  Instructions = 0,
  Capture = 1,
  Result = 2,
}

export const AssessmentFlowScreen = ({ navigation, route }: any) => {
  const { lessonId, lessonTitle } = route.params;
  const user = useAppStore((s) => s.user);
  const [step, setStep] = useState<AssessmentStep>(AssessmentStep.Instructions);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Camera roll permission is required');
      setShowError(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
      setStep(AssessmentStep.Capture);
    }
  };

  const handleCaptureImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Camera permission is required');
      setShowError(true);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
      setStep(AssessmentStep.Capture);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!selectedImage || !user) return;

    setUploading(true);
    try {
      // Upload image
      const imageUrl = await assessmentService.uploadSubmissionImage(
        selectedImage,
        user.id
      );

      // Call assessment
      const assessmentRequest: AssessmentRequest = {
        imageUrl,
        userId: user.id,
        lessonId,
      };

      const assessmentResult = await assessmentService.callAssessAndMint(
        assessmentRequest,
        user.accessToken
      );

      setResult(assessmentResult);
      setStep(AssessmentStep.Result);
    } catch (err: any) {
      setError(err.message || 'Assessment failed');
      setShowError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleGoToProfile = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Profile' }],
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            setStep(AssessmentStep.Instructions);
            setSelectedImage(null);
            setResult(null);
            navigation.goBack();
          }}
        />
        <Appbar.Content title={lessonTitle || 'Assessment'} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {step === AssessmentStep.Instructions && (
          <View>
            <Text style={styles.stepTitle}>Submission Instructions</Text>
            <Text style={styles.instruction}>
              1. Take a clear photo of your completed task
            </Text>
            <Text style={styles.instruction}>
              2. Ensure good lighting and focus
            </Text>
            <Text style={styles.instruction}>
              3. Submit for automated assessment
            </Text>
            <View style={styles.buttonGroup}>
              <PrimaryButton
                label="Take Photo"
                onPress={handleCaptureImage}
                accessible={true}
                accessibilityLabel="Take photo button" children={undefined}              />
              <PrimaryButton
                label="Choose from Library"
                onPress={handlePickImage}
                accessible={true}
                accessibilityLabel="Choose photo from library button" children={undefined}              />
            </View>
          </View>
        )}

        {step === AssessmentStep.Capture && selectedImage && (
          <View>
            <Text style={styles.stepTitle}>Review Your Submission</Text>
            <Image source={{ uri: selectedImage.uri }} style={styles.preview} />
            <View style={styles.buttonGroup}>
              <PrimaryButton
                label={uploading ? 'Submitting...' : 'Submit Assessment'}
                onPress={handleSubmitAssessment}
                loading={uploading}
                disabled={uploading} children={undefined}              />
              <Button
                onPress={() => {
                  setSelectedImage(null);
                  setStep(AssessmentStep.Instructions);
                }}
              >
                Choose Different Photo
              </Button>
            </View>
          </View>
        )}

        {step === AssessmentStep.Result && result && (
          <View>
            <Text
              style={[
                styles.stepTitle,
                { color: result.passed ? '#4caf50' : '#f44336' },
              ]}
            >
              {result.passed ? 'Assessment Passed! ✓' : 'Assessment Pending'}
            </Text>
            <Text style={styles.resultText}>Score: {result.score}%</Text>
            <Text style={styles.resultText}>{result.reason}</Text>
            {result.feedback && (
              <Text style={styles.feedback}>Feedback: {result.feedback}</Text>
            )}
            {result.minted && (
              <Text style={[styles.resultText, { color: '#4caf50' }]}>
                NFT Minted! Token ID: {result.tokenId}
              </Text>
            )}
            <View style={styles.buttonGroup}>
              {result.minted ? (
                <PrimaryButton
                  label="View in Wallet"
                  onPress={handleGoToProfile} children={undefined}                />
              ) : (
                <PrimaryButton
                    label="Try Again"
                    onPress={() => {
                      setStep(AssessmentStep.Instructions);
                      setSelectedImage(null);
                      setResult(null);
                    } } children={undefined}                />
              )}
            </View>
          </View>
        )}
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
    paddingVertical: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  instruction: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: '#333',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  feedback: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
    color: '#666',
  },
  buttonGroup: {
    marginTop: 24,
  },
});
