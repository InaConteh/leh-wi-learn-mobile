import React from 'react';
import { LessonContent, ContentBlock } from '../types/index';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface ContentRendererProps {
  content: LessonContent;
}

export const ContentRenderer = ({ content }: ContentRendererProps) => {
  if (!content || !content.blocks) {
    return <Text>No content available</Text>;
  }

  return (
    <View style={styles.container}>
      {content.blocks.map((block: ContentBlock, idx: number) => (
        <View key={idx} style={styles.blockContainer}>
          {block.type === 'heading' && (
            <Text
              style={[
                styles.heading,
                {
                  fontSize: 24 - (block.data.level || 1) * 2,
                },
              ]}
            >
              {block.data.text}
            </Text>
          )}
          {block.type === 'text' && <Text style={styles.text}>{block.data.text}</Text>}
          {block.type === 'image' && (
            <Text style={styles.imagePlaceholder}>[Image: {block.data.url}]</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  blockContainer: {
    marginBottom: 12,
  },
  heading: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  imagePlaceholder: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
