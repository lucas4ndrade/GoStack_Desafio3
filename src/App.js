import React, { useEffect, useState } from 'react';
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, [])

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`)
    const updatedRepo = response.data;

    const repository = repositories.find(repo => repo.id === id);
    if(repository){
      const repositoryIndex = repositories.indexOf(repository);

      repositories[repositoryIndex] = updatedRepo;
      setRepositories([...repositories]);
    }
  }

  async function handleAddRepository() {
    const response = await api.post(`/repositories`, {
      title: "Repositorio super foda com node",
      url: "http://super-url.com",
      techs: [
        "React",
        "node",
        "Javacripto"
      ]
    })
    const newRepo = response.data;

    setRepositories([...repositories, newRepo])
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <>
          <FlatList 
            style={styles.repositoryContainer}
            data={repositories}
            keyExtractor={repo => repo.id}
            extraData={repositories}
            renderItem={({ item: repository }) => (
              <>
                <Text style={styles.repository}>{repository.title}</Text>

                <View style={styles.techsContainer}>
                  {repository.techs.map((tech, index) => (
                    <Text key={index} style={styles.tech}>
                      {tech}
                    </Text>
                  ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </>
            )}
          />
          <TouchableOpacity
            style={styles.addRepoButton}
            onPress={() => handleAddRepository()}
          >
            <Text style={styles.buttonText}>Adicionar repositório</Text>
          </TouchableOpacity>
        </>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    paddingBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  addRepoButton:{
    alignContent: 'center',
    alignItems: "center"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
