import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars';

const Stack = createStackNavigator();

function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await AsyncStorage.setItem('@user_credentials', JSON.stringify({ username, password }));
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('@user_credentials');
      const credentials = storedCredentials ? JSON.parse(storedCredentials) : {};
      if (username === credentials.username && password === credentials.password) {
        navigation.replace('TaskManager');
      } else {
        Alert.alert('Erro', 'Credenciais inválidas!');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

function TaskManagerScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  const addTask = async () => {
    if (taskInput.trim()) {
      const newTasks = [...tasks, taskInput.trim()];
      setTasks(newTasks);
      await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
      setTaskInput('');
    } else {
      Alert.alert('Erro', 'Por favor, insira uma tarefa válida.');
    }
  };

  const removeTask = async (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Adicionar nova tarefa"
        value={taskInput}
        onChangeText={setTaskInput}
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeTask(index)}>
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.taskList}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

function MoodCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [mood, setMood] = useState('');
  const [moodData, setMoodData] = useState({});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário de Humor</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#00adf5' },
        }}
      />
      <Text style={styles.moodText}>
        Humor de {selectedDate || 'Selecione uma data'}: {mood || 'Nenhum'}
      </Text>
      {/* Botões de emojis e salvar humor */}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="TaskManager" component={TaskManagerScreen} />
        <Stack.Screen name="MoodCalendar" component={MoodCalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#007bff',
    marginTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
