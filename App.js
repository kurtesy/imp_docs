/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  FlatList,
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text>{title}</Text>
      <Text>{children}</Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [documents, setDocuments] = useState([]);

  const selectFile = async () => {
    console.log('data');
    try {
      const files = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      const fileNames = [];
      for (const file of files) {
        console.log(
          file.uri,
          file.type, // mime type
          file.name,
          file.size,
        );
        fileNames.push({uri: file.uri, name: file.name});
      }
      setDocuments([...documents, ...fileNames]);
      // setDocuments(decodeURI(file.uri.replace('file://', '')));
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // The user canceled the document picker.
        console.log('cancel', error);
      } else {
        console.log('error', error);
        throw error;
      }
    }
  };

  const openFile = async uri => {
    console.log('open', uri);
    try {
      await FileViewer.open(uri);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section>
          <Text>IMP Docs</Text>
        </Section>
        <Button title={'Select file'} onPress={selectFile} />
      </ScrollView>
      <FlatList
        data={documents}
        renderItem={({item}) => (
          <Text style={styles.item} onPress={() => openFile(item.uri)}>
            {item.name}
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
